
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Check if user is admin
  // This is just a placeholder - you would typically check a user role in DB
  if (!req.session.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  next();
};
