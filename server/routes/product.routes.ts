import { Router } from 'express';
import { productController } from '../controllers';
import { requireAuth } from '../middleware/auth';
import { requirePermission, restrictByBusinessSize } from '../middleware/rbac';

const router = Router();

// Public routes - none for products

// Protected routes with different permission requirements
router.get('/', requireAuth, requirePermission('product:read'), productController.getProducts);
router.get('/:id', requireAuth, requirePermission('product:read'), productController.getProductById);
router.post('/', requireAuth, requirePermission('product:create'), productController.createProduct);
router.put('/:id', requireAuth, requirePermission('product:update'), productController.updateProduct);
router.delete('/:id', requireAuth, requirePermission('product:delete'), productController.deleteProduct);

// Advanced features only available for medium and large businesses
router.post('/bulk-import', 
  requireAuth, 
  requirePermission('product:create'), 
  restrictByBusinessSize('medium'),
  productController.bulkImportProducts
);

router.get('/analytics/trends', 
  requireAuth, 
  requirePermission('product:read'), 
  restrictByBusinessSize('medium'),
  productController.getProductTrends
);

export default router;