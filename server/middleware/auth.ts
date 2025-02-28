
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "../utils/error";
import User from "../models/user.model";
import Company from "../models/company.model";

// Interface for decoded JWT token
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Type extension for Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      company?: any;
    }
  }
}

// Middleware to check if user is authenticated
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Check if token exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access', 401));
    }

    // 2. Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // 4. Check if company is active and subscription valid
    const company = await Company.findById(user.companyId);
    if (!company) {
      return next(new AppError('Company not found', 404));
    }

    if (!company.isActive) {
      return next(new AppError('Your company account has been deactivated', 403));
    }

    if (company.subscriptionStatus === 'expired') {
      return next(new AppError('Your subscription has expired. Please renew to continue', 402));
    }

    // 5. Set user and company on request object
    req.user = user;
    req.company = company;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token. Please log in again', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Your token has expired. Please log in again', 401));
    }
    next(error);
  }
};

// Check if user has required roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Check if user is active
export const requireActive = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user.isActive) {
    return next(new AppError('This user account has been deactivated', 403));
  }
  next();
};
