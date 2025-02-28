
import { Router } from 'express';
import { productController } from '../controllers';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, productController.getProducts);
router.get('/:id', requireAuth, productController.getProduct);
router.post('/', requireAuth, productController.createProduct);
router.put('/:id', requireAuth, productController.updateProduct);
router.delete('/:id', requireAuth, productController.deleteProduct);

export default router;
