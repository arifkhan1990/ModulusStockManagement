
import express from 'express';
import adminController from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth';
import { checkPermission } from '../middleware/rbac';

const router = express.Router();

// Protect all routes - require authentication and admin permission
router.use(requireAuth);
router.use(checkPermission('admin:access'));

// System logs routes
router.get('/logs', adminController.getSystemLogs);
router.post('/logs/clear', adminController.clearSystemLogs);

// Feature toggle routes
router.get('/features', adminController.getFeatureToggles);
router.post('/features', adminController.createFeatureToggle);
router.put('/features/:id', adminController.updateFeatureToggle);
router.delete('/features/:id', adminController.deleteFeatureToggle);

// Cache management
router.post('/cache/clear', adminController.clearCache);

export default router;
