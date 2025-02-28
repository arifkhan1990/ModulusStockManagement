
import express from 'express';
import adminController from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth';
import { restrictTo } from '../middleware/rbac';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(restrictTo('admin'));

// System logs
router.get('/logs', adminController.getSystemLogs);

// Feature toggles
router.get('/feature-toggles', adminController.getFeatureToggles);
router.put('/feature-toggles/:id', adminController.updateFeatureToggle);

// Cache management
router.post('/clear-cache', adminController.clearCache);

// System statistics
router.get('/statistics', adminController.getSystemStats);

export default router;
