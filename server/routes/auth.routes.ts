
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
