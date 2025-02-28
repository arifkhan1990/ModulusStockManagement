
import express from 'express';
import { requireSystemAdmin } from '../middleware/rbac';
import subscriptionTierValidator from '../validators/subscription-tier.validator';
import * as subscriptionTierController from '../controllers/subscription-tier.controller';

const router = express.Router();

// Get all subscription tiers
router.get('/', subscriptionTierController.getAllSubscriptionTiers);

// Get a single subscription tier
router.get('/:id', subscriptionTierController.getSubscriptionTier);

// Create a new subscription tier (admin only)
router.post(
  '/',
  requireSystemAdmin,
  subscriptionTierValidator.validateCreate,
  subscriptionTierController.createSubscriptionTier
);

// Update subscription tier (admin only)
router.put(
  '/:id',
  requireSystemAdmin,
  subscriptionTierValidator.validateUpdate,
  subscriptionTierController.updateSubscriptionTier
);

// Delete subscription tier (admin only)
router.delete(
  '/:id',
  requireSystemAdmin,
  subscriptionTierController.deleteSubscriptionTier
);

export default router;
