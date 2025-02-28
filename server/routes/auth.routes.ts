
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import passport from "passport";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

// Registration route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Logout route
router.post("/logout", authController.logout);

// Get current user route
router.get("/me", isAuthenticated, authController.getCurrentUser);

// Password reset
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Profile update
router.put("/profile", isAuthenticated, authController.updateProfile);

// Password change
router.post("/change-password", isAuthenticated, authController.changePassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/auth/login",
    session: true
  }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or home
    res.redirect("/dashboard");
  }
);

export default router;
