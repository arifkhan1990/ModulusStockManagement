
import { Router } from 'express';
import { supplierController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, supplierController.getSuppliers);
router.get('/:id', requireAuth, supplierController.getSupplier);
router.post('/', requireAuth, supplierController.createSupplier);
router.put('/:id', requireAuth, supplierController.updateSupplier);
router.delete('/:id', requireAuth, supplierController.deleteSupplier);

export default router;
