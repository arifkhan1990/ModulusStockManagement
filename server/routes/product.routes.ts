
import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';
import { requireSystemAdmin } from '../middleware/rbac';
import { validateProduct } from '../validators/product.validator';

const router = Router();

// Public routes
router.get('/products/public', productController.getPublicProducts);

// Protected routes
router.get('/products', requireAuth, requireSystemAdmin, productController.getProducts);
router.get('/products/:id', requireAuth, requireSystemAdmin, productController.getProductById);
router.post('/products', requireAuth, requireSystemAdmin, validateProduct, productController.createProduct);
router.put('/products/:id', requireAuth, requireSystemAdmin, validateProduct, productController.updateProduct);
router.delete('/products/:id', requireAuth, requireSystemAdmin, productController.deleteProduct);

// Batch operations
router.post('/products/bulk', requireAuth, requireSystemAdmin, productController.bulkCreateProducts);
router.put('/products/bulk', requireAuth, requireSystemAdmin, productController.bulkUpdateProducts);

// Stock related operations
router.post('/products/:id/stock/adjust', requireAuth, requireSystemAdmin, productController.adjustStock);
router.post('/products/transfer', requireAuth, requireSystemAdmin, productController.transferStock);
router.get('/products/low-stock', requireAuth, requireSystemAdmin, productController.getLowStockProducts);

// Category operations
router.get('/products/categories', requireAuth, requireSystemAdmin, productController.getCategories);
router.post('/products/categories', requireAuth, requireSystemAdmin, productController.createCategory);
router.put('/products/categories/:id', requireAuth, requireSystemAdmin, productController.updateCategory);
router.delete('/products/categories/:id', requireAuth, requireSystemAdmin, productController.deleteCategory);

// Analytics
router.get('/products/analytics/sales', requireAuth, requireSystemAdmin, productController.getProductSalesAnalytics);
router.get('/products/analytics/stock', requireAuth, requireSystemAdmin, productController.getStockLevelAnalytics);

export default router;
