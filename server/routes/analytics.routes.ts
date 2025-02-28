
import express from 'express';
import analyticsController from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth';
import { requireSystemAdmin } from '../middleware/rbac';
import analyticsValidator from '../validators/analytics.validator';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Track events
router.post('/track/feature', analyticsValidator.validateFeatureTracking, analyticsController.trackFeatureUsage);
router.post('/track/page', analyticsValidator.validatePageTracking, analyticsController.trackPageView);
router.post('/track/error', analyticsValidator.validateErrorTracking, analyticsController.trackError);

// Get company analytics (for subscribers)
router.get('/company', analyticsController.getCompanyAnalytics);

// Get SaaS-wide analytics (for system admins)
router.get('/saas', requireSystemAdmin, analyticsController.getSaasAnalytics);

export default router;
