import { Router } from 'express';
import { inventoryController } from '../controllers';
import { requireAuth } from '../middleware/auth';
import { requirePermission, restrictByBusinessSize } from '../middleware/rbac';

const router = Router();

// Basic inventory operations with appropriate permissions
router.get('/', requireAuth, requirePermission('inventory:read'), inventoryController.getInventories);
router.get('/product/:productId', requireAuth, requirePermission('inventory:read'), inventoryController.getInventoryByProduct);
router.get('/location/:locationId', requireAuth, requirePermission('inventory:read'), inventoryController.getInventoryByLocation);
router.post('/', requireAuth, requirePermission('inventory:create'), inventoryController.createInventory);
router.put('/:id', requireAuth, requirePermission('inventory:update'), inventoryController.updateInventory);

// Advanced features for medium and large businesses
router.get('/analytics/valuation', 
  requireAuth, 
  requirePermission('inventory:read'), 
  restrictByBusinessSize('medium'),
  inventoryController.getInventoryValuation
);

router.get('/analytics/turnover', 
  requireAuth, 
  requirePermission('inventory:read'), 
  restrictByBusinessSize('medium'),
  inventoryController.getInventoryTurnover
);

// Features only for large businesses
router.get('/forecasting', 
  requireAuth, 
  requirePermission('inventory:read'), 
  restrictByBusinessSize('large'),
  inventoryController.getInventoryForecasting
);

export default router;