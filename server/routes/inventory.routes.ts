
import { Router } from 'express';
import { inventoryController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/:locationId', requireAuth, inventoryController.getInventory);
router.post('/', requireAuth, inventoryController.createInventory);

export default router;
