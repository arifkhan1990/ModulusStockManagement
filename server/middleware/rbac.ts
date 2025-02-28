
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';

// Define permission types
export type Permission = string;

// Define permission sets for different roles
export const PERMISSIONS = {
  // Admin can do everything
  admin: [
    'user:create', 'user:read', 'user:update', 'user:delete',
    'product:create', 'product:read', 'product:update', 'product:delete',
    'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete',
    'supplier:create', 'supplier:read', 'supplier:update', 'supplier:delete',
    'order:create', 'order:read', 'order:update', 'order:delete',
    'payment:create', 'payment:read', 'payment:update', 'payment:delete',
    'report:create', 'report:read', 'report:export',
    'settings:read', 'settings:update',
  ],
  // Manager has most permissions except user management and settings
  manager: [
    'user:read',
    'product:create', 'product:read', 'product:update',
    'inventory:create', 'inventory:read', 'inventory:update',
    'supplier:create', 'supplier:read', 'supplier:update',
    'order:create', 'order:read', 'order:update',
    'payment:create', 'payment:read', 'payment:update',
    'report:create', 'report:read', 'report:export',
  ],
  // Staff has limited permissions
  staff: [
    'product:read',
    'inventory:read', 'inventory:update',
    'supplier:read',
    'order:create', 'order:read', 'order:update',
    'payment:create', 'payment:read',
    'report:read',
  ],
  // Viewers can only read data
  viewer: [
    'product:read',
    'inventory:read',
    'supplier:read',
    'order:read',
    'payment:read',
    'report:read',
  ],
  // Customers have very limited access
  customer: [
    'order:create', 'order:read',
    'payment:create', 'payment:read',
  ],
  // Suppliers can only manage their products
  supplier: [
    'product:read',
    'inventory:read',
  ],
};

// Get permissions for a specific role
export const getRolePermissions = (role: string): Permission[] => {
  return PERMISSIONS[role as keyof typeof PERMISSIONS] || [];
};

// Get all permissions for a user including custom permissions
export const getUserPermissions = (user: IUser): Permission[] => {
  const rolePermissions = getRolePermissions(user.role);
  return [...rolePermissions, ...(user.permissions || [])];
};

// Check if a user has a specific permission
export const hasPermission = (user: IUser, permission: Permission): boolean => {
  if (user.role === 'admin') return true; // Admin has all permissions
  
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
};

// Middleware to check if a user has the required permission
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    if (hasPermission(req.user as IUser, permission)) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  };
};

// Middleware to restrict access based on business size
export const restrictByBusinessSize = (minSize: 'small' | 'medium' | 'large') => {
  const sizeOrder = { small: 1, medium: 2, large: 3 };
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    
    const user = req.user as IUser;
    const userSizeValue = sizeOrder[user.businessSize as keyof typeof sizeOrder] || 0;
    const minSizeValue = sizeOrder[minSize];
    
    if (userSizeValue >= minSizeValue || user.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ 
      message: `This feature is only available for ${minSize} or larger business subscriptions` 
    });
  };
};

// Middleware to restrict access based on business type
export const restrictByBusinessType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    
    const user = req.user as IUser;
    
    if (allowedTypes.includes(user.businessType || '') || user.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ 
      message: `This feature is only available for ${allowedTypes.join(', ')} business types` 
    });
  };
};
