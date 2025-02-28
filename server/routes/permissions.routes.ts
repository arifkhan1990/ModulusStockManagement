
import { Router } from 'express';
import * as permissionsController from '../controllers/permissions.controller';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// Get all available permissions (admin only)
router.get('/', 
  requireAuth, 
  requirePermission('user:update'), 
  permissionsController.getAllPermissions
);

// Get current user's permissions
router.get('/me', 
  requireAuth, 
  permissionsController.getCurrentUserPermissions
);

// Get permissions for a specific user (admin only)
router.get('/user/:userId', 
  requireAuth, 
  requirePermission('user:read'), 
  permissionsController.getUserPermissionsById
);

// Update permissions for a specific user (admin only)
router.put('/user/:userId', 
  requireAuth, 
  requirePermission('user:update'), 
  permissionsController.updateUserPermissions
);

export default router;
