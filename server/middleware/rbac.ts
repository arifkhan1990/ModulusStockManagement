import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import Role from "../models/role.model";

// Define roles and their hierarchy
export const roles = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  CASHIER: "cashier",
  VIEWER: "viewer",
};

// Role hierarchy and permissions
const roleHierarchy = {
  [roles.ADMIN]: [
    roles.ADMIN,
    roles.MANAGER,
    roles.STAFF,
    roles.CASHIER,
    roles.VIEWER,
  ],
  [roles.MANAGER]: [roles.MANAGER, roles.STAFF, roles.CASHIER, roles.VIEWER],
  [roles.STAFF]: [roles.STAFF, roles.CASHIER, roles.VIEWER],
  [roles.CASHIER]: [roles.CASHIER, roles.VIEWER],
  [roles.VIEWER]: [roles.VIEWER],
};

// Resource permissions by role
const resourcePermissions = {
  products: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["create", "read", "update"],
    [roles.STAFF]: ["read", "update"],
    [roles.CASHIER]: ["read"],
    [roles.VIEWER]: ["read"],
  },
  inventory: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["create", "read", "update"],
    [roles.STAFF]: ["read", "update"],
    [roles.CASHIER]: ["read"],
    [roles.VIEWER]: ["read"],
  },
  invoices: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["create", "read", "update"],
    [roles.STAFF]: ["create", "read", "update"],
    [roles.CASHIER]: ["create", "read"],
    [roles.VIEWER]: ["read"],
  },
  orders: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["create", "read", "update"],
    [roles.STAFF]: ["create", "read", "update"],
    [roles.CASHIER]: ["create", "read"],
    [roles.VIEWER]: ["read"],
  },
  users: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["read"],
    [roles.STAFF]: ["read"],
    [roles.CASHIER]: ["read"],
    [roles.VIEWER]: ["read"],
  },
  customers: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["create", "read", "update"],
    [roles.STAFF]: ["create", "read", "update"],
    [roles.CASHIER]: ["read"],
    [roles.VIEWER]: ["read"],
  },
  settings: {
    [roles.ADMIN]: ["create", "read", "update", "delete"],
    [roles.MANAGER]: ["read"],
    [roles.STAFF]: [],
    [roles.CASHIER]: [],
    [roles.VIEWER]: [],
  },
  reports: {
    [roles.ADMIN]: ["read"],
    [roles.MANAGER]: ["read"],
    [roles.STAFF]: ["read"],
    [roles.CASHIER]: [],
    [roles.VIEWER]: ["read"],
  },
};

/**
 * Middleware to check if a user has permission to access a resource
 */
export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return next(new AppError("Unauthorized access", 401));
    }

    // Check if user has permission
    if (hasPermission(req.user.role, resource, action)) {
      return next();
    }

    // If not, return forbidden error
    return next(
      new AppError("You do not have permission to perform this action", 403),
    );
  };
};

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("Unauthorized access", 401));
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(
      new AppError("You do not have permission to perform this action", 403),
    );
  };
};

// Require system admin role
export const requireSystemAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    // Check if user is a system admin
    if (req.user.type !== "system_admin") {
      return next(
        new AppError(
          "Access denied. System administrator privileges required.",
          403,
        ),
      );
    }

    // If we're here, the user is a system admin
    next();
  } catch (error) {
    next(error);
  }
};

// Require company admin role
export const requireCompanyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    // Check if user is a company admin
    if (req.user.type === "company_admin") {
      return next();
    }

    // Check if user has company admin role
    if (req.user.roleIds && req.user.roleIds.length > 0) {
      const roles = await Role.find({
        _id: { $in: req.user.roleIds },
        companyId: req.company._id,
      });

      const hasAdminPermission = roles.some(
        (role) =>
          role.permissions.includes("admin") ||
          role.permissions.includes("company_admin"),
      );

      if (hasAdminPermission) {
        return next();
      }
    }

    return next(
      new AppError(
        "Access denied. Company administrator privileges required.",
        403,
      ),
    );
  } catch (error) {
    next(error);
  }
};

// Check if user has specific permission
export const hasPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError("Authentication required", 401));
      }

      // System admins have all permissions
      if (req.user.type === "system_admin") {
        return next();
      }

      // Company admins have all permissions for their company
      if (req.user.type === "company_admin" && req.company) {
        return next();
      }

      // Check specific permission
      if (req.user.roleIds && req.user.roleIds.length > 0) {
        const roles = await Role.find({
          _id: { $in: req.user.roleIds },
          companyId: req.company._id,
        });

        const hasRequiredPermission = roles.some(
          (role) =>
            role.permissions.includes(permission) ||
            role.permissions.includes("admin"),
        );

        if (hasRequiredPermission) {
          return next();
        }
      }

      return next(
        new AppError(
          `Access denied. '${permission}' permission required.`,
          403,
        ),
      );
    } catch (error) {
      next(error);
    }
  };
};

export default {
  roles,
  requirePermission,
  restrictTo,
  requireSystemAdmin,
  requireCompanyAdmin,
  hasPermission,
};
