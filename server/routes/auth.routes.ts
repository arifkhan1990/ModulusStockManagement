
import { Router } from "express";
import { 
  register, 
  login, 
  logout, 
  getCurrentUser 
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;
import { Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers';
import config from '../config';

const router = Router();

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', passport.authenticate('local'), authController.login);

// Logout route
router.post('/logout', authController.logout);

// Get current user route
router.get('/user', authController.getCurrentUser);

// Google OAuth routes (if configured)
if (config.auth.googleClientId && config.auth.googleClientSecret) {
  router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth' }),
    (req, res) => {
      res.redirect('/');
    }
  );
}

export default router;
