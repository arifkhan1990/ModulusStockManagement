
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
import { Request, Response, NextFunction } from 'express';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from '../storage';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await storage.getUserByUsername(req.body.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
      provider: "local",
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response) => {
  res.json(req.user);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
};

export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  res.json(req.user);
};
