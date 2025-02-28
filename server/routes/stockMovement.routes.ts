
import { Router } from 'express';
import * as stockMovementController from '../controllers/stockMovement.controller';
import { requireAuth, restrictTo } from '../middleware/auth';
import cacheResponse from '../middleware/cache';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Stock movement routes
router.post(
  '/',
  restrictTo('admin', 'manager', 'staff'),
  stockMovementController.createStockMovement
);

router.get(
  '/',
  cacheResponse(60),
  stockMovementController.getStockMovements
);

router.get(
  '/:id',
  cacheResponse(60),
  stockMovementController.getStockMovementById
);

router.patch(
  '/:id/status',
  restrictTo('admin', 'manager'),
  stockMovementController.updateStockMovementStatus
);

export default router;
