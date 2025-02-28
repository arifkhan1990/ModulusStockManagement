
import express from 'express';
import billingController from '../controllers/billing.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdminRole } from '../middleware/rbac';
import billingValidator from '../validators/billing.validator';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get subscription details for current company
router.get('/subscription', billingController.getSubscriptionDetails);

// Get billing history for current company
router.get('/history', billingController.getBillingHistory);

// Process new subscription - requires admin role
router.post(
  '/process-subscription',
  requireAdminRole,
  billingValidator.validateSubscriptionProcess,
  billingController.processSubscription
);

// Update subscription - requires admin role
router.put(
  '/subscription/:companyId',
  requireAdminRole,
  billingValidator.validateSubscriptionUpdate,
  billingController.updateSubscription
);

// Cancel subscription - requires admin role
router.post(
  '/subscription/:companyId/cancel',
  requireAdminRole,
  billingValidator.validateSubscriptionCancel,
  billingController.cancelSubscription
);

export default router;
