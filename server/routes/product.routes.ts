import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { validateProduct } from '../validators/product.validator';
import { checkFeatureAccess } from '../middleware/rbac';

const router = Router();

// Public routes
router.get('/products/public', productController.getPublicProducts);

// Protected routes
router.get('/products', authenticate, checkFeatureAccess('stock_management'), productController.getProducts);
router.get('/products/:id', authenticate, checkFeatureAccess('stock_management'), productController.getProductById);
router.post('/products', authenticate, checkFeatureAccess('stock_management'), validateProduct, productController.createProduct);
router.put('/products/:id', authenticate, checkFeatureAccess('stock_management'), validateProduct, productController.updateProduct);
router.delete('/products/:id', authenticate, checkFeatureAccess('stock_management'), productController.deleteProduct);

// Batch operations
router.post('/products/bulk', authenticate, checkFeatureAccess('stock_management'), productController.bulkCreateProducts);
router.put('/products/bulk', authenticate, checkFeatureAccess('stock_management'), productController.bulkUpdateProducts);

// Stock related operations
router.post('/products/:id/stock/adjust', authenticate, checkFeatureAccess('stock_management'), productController.adjustStock);
router.post('/products/transfer', authenticate, checkFeatureAccess('stock_management'), productController.transferStock);
router.get('/products/low-stock', authenticate, checkFeatureAccess('stock_management'), productController.getLowStockProducts);

// Category operations
router.get('/categories', authenticate, checkFeatureAccess('stock_management'), productController.getCategories);
router.post('/categories', authenticate, checkFeatureAccess('stock_management'), productController.createCategory);
router.put('/categories/:id', authenticate, checkFeatureAccess('stock_management'), productController.updateCategory);
router.delete('/categories/:id', authenticate, checkFeatureAccess('stock_management'), productController.deleteCategory);

// Analytics
router.get('/products/analytics/sales', authenticate, checkFeatureAccess('analytics'), productController.getProductSalesAnalytics);
router.get('/products/analytics/stock', authenticate, checkFeatureAccess('analytics'), productController.getStockLevelAnalytics);

export default router;