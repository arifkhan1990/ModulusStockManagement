
import { Request, Response } from "express";
import User from "../models/user.model";
import { createSession, destroySession } from "../services/session.service";
import { validateLoginInput, validateRegisterInput } from "../validators/auth.validator";
import { hashPassword, comparePassword } from "../utils/password";
import { AppError } from "../utils/error";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = validateRegisterInput(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    // Create session
    await createSession(req, user);
    
    // Return user data without password
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else {
      console.error("Register error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = validateLoginInput(req.body);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }
    
    // Create session
    await createSession(req, user);
    
    // Return user data without password
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else {
      console.error("Login error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const logout = (req: Request, res: Response) => {
  destroySession(req);
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      destroySession(req);
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
