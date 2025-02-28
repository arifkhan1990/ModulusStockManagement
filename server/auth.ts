import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { IUser } from "@shared/schema";
import config from "./config";
import { comparePasswords } from "./controllers/auth.controller";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export function setupAuth(app: Express) {
  // Configure session
  const sessionSettings: session.SessionOptions = {
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
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

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !user.password || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
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
            let user = await storage.getUserByProviderId("google", profile.id);

            if (!user) {
              user = await storage.createUser({
                username: profile.emails![0].value,
                email: profile.emails![0].value,
                name: profile.displayName,
                provider: "google",
                providerId: profile.id,
              });
            }

            done(null, user);
          } catch (error) {
            done(error);
          }
        },
      ),
    );
  }

  // Configure passport serialization
  passport.serializeUser((user, done) => {
    // Use _id which is the MongoDB document ID
    done(null, user._id ? user._id.toString() : user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}