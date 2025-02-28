
import express from 'express';
import featureController from '../controllers/feature.controller';
import { requireAuth } from '../middleware/auth';
import { requireSystemAdmin } from '../middleware/rbac';
import featureValidator from '../validators/feature.validator';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// System admin only routes
router.post('/', requireSystemAdmin, featureValidator.validateCreate, featureController.createFeature);
router.get('/', requireSystemAdmin, featureController.getFeatures);
router.get('/:id', requireSystemAdmin, featureController.getFeature);
router.put('/:id', requireSystemAdmin, featureValidator.validateUpdate, featureController.updateFeature);
router.delete('/:id', requireSystemAdmin, featureController.deleteFeature);
router.patch('/:id/toggle', requireSystemAdmin, featureController.toggleFeatureStatus);
router.patch('/:id/rollout', requireSystemAdmin, featureValidator.validateRolloutUpdate, featureController.updateRolloutPercentage);

export default router;
