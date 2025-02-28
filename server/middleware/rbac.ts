
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

// Define roles and their hierarchy
export const roles = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CASHIER: 'cashier',
  VIEWER: 'viewer'
};

// Role hierarchy and permissions
const roleHierarchy = {
  [roles.ADMIN]: [roles.ADMIN, roles.MANAGER, roles.STAFF, roles.CASHIER, roles.VIEWER],
  [roles.MANAGER]: [roles.MANAGER, roles.STAFF, roles.CASHIER, roles.VIEWER],
  [roles.STAFF]: [roles.STAFF, roles.CASHIER, roles.VIEWER],
  [roles.CASHIER]: [roles.CASHIER, roles.VIEWER],
  [roles.VIEWER]: [roles.VIEWER]
};

// Resource permissions by role
const resourcePermissions = {
  products: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['create', 'read', 'update'],
    [roles.STAFF]: ['read', 'update'],
    [roles.CASHIER]: ['read'],
    [roles.VIEWER]: ['read']
  },
  inventory: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['create', 'read', 'update'],
    [roles.STAFF]: ['read', 'update'],
    [roles.CASHIER]: ['read'],
    [roles.VIEWER]: ['read']
  },
  invoices: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['create', 'read', 'update'],
    [roles.STAFF]: ['create', 'read', 'update'],
    [roles.CASHIER]: ['create', 'read'],
    [roles.VIEWER]: ['read']
  },
  orders: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['create', 'read', 'update'],
    [roles.STAFF]: ['create', 'read', 'update'],
    [roles.CASHIER]: ['create', 'read'],
    [roles.VIEWER]: ['read']
  },
  users: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['read'],
    [roles.STAFF]: ['read'],
    [roles.CASHIER]: ['read'],
    [roles.VIEWER]: ['read']
  },
  customers: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['create', 'read', 'update'],
    [roles.STAFF]: ['create', 'read', 'update'],
    [roles.CASHIER]: ['read'],
    [roles.VIEWER]: ['read']
  },
  settings: {
    [roles.ADMIN]: ['create', 'read', 'update', 'delete'],
    [roles.MANAGER]: ['read'],
    [roles.STAFF]: [],
    [roles.CASHIER]: [],
    [roles.VIEWER]: []
  },
  reports: {
    [roles.ADMIN]: ['read'],
    [roles.MANAGER]: ['read'],
    [roles.STAFF]: ['read'],
    [roles.CASHIER]: [],
    [roles.VIEWER]: ['read']
  }
};

/**
 * Check if a role has access to a specific resource and action
 */
const hasPermission = (role: string, resource: string, action: string): boolean => {
  if (!roleHierarchy[role]) return false;
  if (!resourcePermissions[resource]) return false;
  
  // Check each role in the hierarchy
  for (const r of roleHierarchy[role]) {
    if (
      resourcePermissions[resource][r] && 
      resourcePermissions[resource][r].includes(action)
    ) {
      return true;
    }
  }
  
  return false;
};

/**
 * Middleware to check if a user has permission to access a resource
 */
export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return next(new AppError('Unauthorized access', 401));
    }

    // Check if user has permission
    if (hasPermission(req.user.role, resource, action)) {
      return next();
    }

    // If not, return forbidden error
    return next(new AppError('You do not have permission to perform this action', 403));
  };
};

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Unauthorized access', 401));
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(new AppError('You do not have permission to perform this action', 403));
  };
};

export default {
  roles,
  requirePermission,
  restrictTo
};
