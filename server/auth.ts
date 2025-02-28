import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Express, Request } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import User from "./models/user.model";
import Company from "./models/company.model";
import config from "./config";
import mongoose from "mongoose";
import { comparePassword } from "./utils/password";

export function setupAuth(app: Express) {
  // Configure session with MongoDB store
  const sessionSettings: session.SessionOptions = {
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.database.url,
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: 'native',
      collectionName: 'sessions',
    }),
    cookie: {
      secure: config.session.secureCookies,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
  };

  // Trust proxy for secure cookies
  app.set("trust proxy", 1);

  // Initialize session and passport
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy with email
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email }).select('+password');
          
          if (!user || !(await comparePassword(password, user.password))) {
            return done(null, false, { message: "Invalid credentials" });
          }
          
          // Check if user's company subscription is active
          const company = await Company.findById(user.companyId);
          if (!company || !company.isActive || company.subscriptionStatus === 'expired') {
            return done(null, false, { message: "Subscription expired or inactive" });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // JWT strategy for API access
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);
          
          if (!user) {
            return done(null, false);
          }
          
          // Check if user's company subscription is active
          const company = await Company.findById(user.companyId);
          if (!company || !company.isActive || company.subscriptionStatus === 'expired') {
            return done(null, false);
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Configure Google OAuth strategy if available
  if (config.auth.googleClientId && config.auth.googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.auth.googleClientId,
          clientSecret: config.auth.googleClientSecret,
          callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ 
              provider: "google", 
              providerId: profile.id 
            });

            if (!user && profile.emails && profile.emails.length > 0) {
              // Check if user exists with this email
              user = await User.findOne({ email: profile.emails[0].value });
              
              if (user) {
                // Update existing user with Google provider info
                user.provider = "google";
                user.providerId = profile.id;
                await user.save();
              } else {
                // Create new user
                // Note: This would need to be modified to include company registration
                // for a complete implementation
                return done(null, false, { 
                  message: "Please register with email first to connect your Google account" 
                });
              }
            }

            if (!user) {
              return done(null, false, { 
                message: "No account found with this Google account" 
              });
            }

            // Check subscription status
            const company = await Company.findById(user.companyId);
            if (!company || !company.isActive || company.subscriptionStatus === 'expired') {
              return done(null, false, { message: "Subscription expired or inactive" });
            }

            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }

  // Configure passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return done(null, false);
      }
      
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}