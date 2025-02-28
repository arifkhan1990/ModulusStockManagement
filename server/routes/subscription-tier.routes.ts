
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { requireSystemAdmin } from '../middleware/rbac';
import subscriptionTierValidator from '../validators/subscription-tier.validator';

// Import controller with named exports
import * as subscriptionTierController from '../controllers/subscription-tier.controller';

// Define routes below this line
router.get('/', subscriptionTierController.getAllSubscriptionTiers);
router.post('/', requireSystemAdmin, subscriptionTierValidator.validateCreate, subscriptionTierController.createSubscriptionTier);
router.get('/:id', subscriptionTierController.getSubscriptionTier);
router.put('/:id', requireSystemAdmin, subscriptionTierController.updateSubscriptionTier);
router.delete('/:id', requireSystemAdmin, subscriptionTierController.deleteSubscriptionTier);

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// System admin only routes
router.post('/', requireSystemAdmin, subscriptionTierValidator.validateCreate, subscriptionTierController.createSubscriptionTier);
router.get('/', requireSystemAdmin, subscriptionTierController.getSubscriptionTiers);
router.get('/:id', requireSystemAdmin, subscriptionTierController.getSubscriptionTier);
router.put('/:id', requireSystemAdmin, subscriptionTierValidator.validateUpdate, subscriptionTierController.updateSubscriptionTier);
router.delete('/:id', requireSystemAdmin, subscriptionTierController.deleteSubscriptionTier);
router.patch('/:id/toggle', requireSystemAdmin, subscriptionTierController.toggleTierStatus);

export default router;
