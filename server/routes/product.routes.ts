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
import { Router } from 'express';
import { requireAuth, restrictTo } from '../middleware/auth';
import { cacheResponse } from '../middleware/cache';
import * as productController from '../controllers/product.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Product routes
router.post('/', restrictTo('admin', 'manager'), productController.createProduct);
router.get('/', cacheResponse(60), productController.getProducts);
router.get('/categories', cacheResponse(300), productController.getCategories);
router.post('/import', restrictTo('admin', 'manager'), productController.importProducts);
router.get('/:id', cacheResponse(60), productController.getProduct);
router.put('/:id', restrictTo('admin', 'manager'), productController.updateProduct);
router.delete('/:id', restrictTo('admin', 'manager'), productController.deleteProduct);

export default router;
