
import { Router } from 'express';
import { stockMovementController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, stockMovementController.createStockMovement);
router.get('/', requireAuth, stockMovementController.getStockMovements);

export default router;
