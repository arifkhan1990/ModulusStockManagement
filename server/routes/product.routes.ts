import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';
import { validateProduct } from '../validators/product.validator';
import { checkFeatureAccess } from '../middleware/rbac';

const router = Router();

// Public routes
router.get('/products/public', productController.getPublicProducts);

// Protected routes
router.get('/products', requireAuth, checkFeatureAccess('stock_management'), productController.getProducts);
router.get('/products/:id', requireAuth, checkFeatureAccess('stock_management'), productController.getProductById);
router.post('/products', requireAuth, checkFeatureAccess('stock_management'), validateProduct, productController.createProduct);
router.put('/products/:id', requireAuth, checkFeatureAccess('stock_management'), validateProduct, productController.updateProduct);
router.delete('/products/:id', requireAuth, checkFeatureAccess('stock_management'), productController.deleteProduct);

// Batch operations
router.post('/products/bulk', requireAuth, checkFeatureAccess('stock_management'), productController.bulkCreateProducts);
router.put('/products/bulk', requireAuth, checkFeatureAccess('stock_management'), productController.bulkUpdateProducts);

// Stock related operations
router.post('/products/:id/stock/adjust', requireAuth, checkFeatureAccess('stock_management'), productController.adjustStock);
router.post('/products/transfer', requireAuth, checkFeatureAccess('stock_management'), productController.transferStock);
router.get('/products/low-stock', requireAuth, checkFeatureAccess('stock_management'), productController.getLowStockProducts);

// Category operations
router.get('/categories', requireAuth, checkFeatureAccess('stock_management'), productController.getCategories);
router.post('/categories', requireAuth, checkFeatureAccess('stock_management'), productController.createCategory);
router.put('/categories/:id', requireAuth, checkFeatureAccess('stock_management'), productController.updateCategory);
router.delete('/categories/:id', requireAuth, checkFeatureAccess('stock_management'), productController.deleteCategory);

// Analytics
router.get('/products/analytics/sales', requireAuth, checkFeatureAccess('analytics'), productController.getProductSalesAnalytics);
router.get('/products/analytics/stock', requireAuth, checkFeatureAccess('analytics'), productController.getStockLevelAnalytics);

export default router;