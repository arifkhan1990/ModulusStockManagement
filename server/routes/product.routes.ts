
import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';
import { requireSystemAdmin } from '../middleware/rbac';
import { validateProduct } from '../validators/product.validator';

const router = Router();

// Public routes
router.get('/public', productController.getPublicProducts);

// Protected routes
router.get('/', requireAuth, requireSystemAdmin, productController.getProducts);
router.get('/:id', requireAuth, requireSystemAdmin, productController.getProductById);
router.post('/', requireAuth, requireSystemAdmin, validateProduct, productController.createProduct);
router.put('/:id', requireAuth, requireSystemAdmin, validateProduct, productController.updateProduct);
router.delete('/:id', requireAuth, requireSystemAdmin, productController.deleteProduct);

// Batch operations
router.post('/bulk', requireAuth, requireSystemAdmin, productController.bulkCreateProducts);
router.put('/bulk', requireAuth, requireSystemAdmin, productController.bulkUpdateProducts);

// Stock related operations
router.post('/:id/stock/adjust', requireAuth, requireSystemAdmin, productController.adjustStock);
router.post('/transfer', requireAuth, requireSystemAdmin, productController.transferStock);
router.get('/low-stock', requireAuth, requireSystemAdmin, productController.getLowStockProducts);

// Category operations
router.get('/categories', requireAuth, requireSystemAdmin, productController.getCategories);
router.post('/categories', requireAuth, requireSystemAdmin, productController.createCategory);
router.put('/categories/:id', requireAuth, requireSystemAdmin, productController.updateCategory);
router.delete('/categories/:id', requireAuth, requireSystemAdmin, productController.deleteCategory);

// Analytics
router.get('/analytics/sales', requireAuth, requireSystemAdmin, productController.getProductSalesAnalytics);
router.get('/analytics/stock', requireAuth, requireSystemAdmin, productController.getStockLevelAnalytics);

export default router;
