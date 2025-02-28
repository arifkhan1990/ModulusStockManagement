
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { AppError } from "../utils/error";

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Check for API authentication with JWT
  return passport.authenticate("jwt", { session: false })(req, res, next);
};

// Middleware to check if user has required role
export const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You must be logged in to access this resource", 401));
    }
    
    if (roles.includes(req.user.role)) {
      return next();
    }
    
    next(new AppError("You do not have permission to perform this action", 403));
  };
};

// Middleware to check if user has specific permissions
export const hasPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You must be logged in to access this resource", 401));
    }
    
    // Admin has all permissions
    if (req.user.role === "admin") {
      return next();
    }
    
    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission => 
      req.user.permissions?.includes(permission)
    );
    
    if (hasAllPermissions) {
      return next();
    }
    
    next(new AppError("You do not have permission to perform this action", 403));
  };
};

// Middleware to check if user belongs to the same company
export const isSameCompany = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("You must be logged in to access this resource", 401));
  }
  
  const companyId = req.params.companyId || req.body.companyId;
  
  if (companyId && req.user.companyId.toString() !== companyId) {
    return next(new AppError("You can only access resources from your company", 403));
  }
  
  next();
};

// Middleware to check if user is admin of the company
export const isCompanyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("You must be logged in to access this resource", 401));
  }
  
  if (req.user.role !== "admin") {
    return next(new AppError("Only company administrators can perform this action", 403));
  }
  
  next();
};
