
import express from 'express';
import * as productController from '../controllers/product.controller';
import { validateProductCreation, validateProductUpdate } from '../validators/product.validator';
import { authenticate } from '../middleware/auth';
import { checkFeatureEnabled } from '../middleware/feature-toggle';

const router = express.Router();

// Public routes
router.get('/public/:companyId', productController.getPublicProducts);

// Protected routes
router.use(authenticate);

// Basic product operations
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', validateProductCreation, productController.createProduct);
router.put('/:id', validateProductUpdate, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Stock management routes
router.post('/transfer', 
  checkFeatureEnabled('inventory_management'),
  productController.transferStock
);

// Bulk operations - require specific features
router.post('/bulk-import', 
  checkFeatureEnabled('import_export'),
  productController.bulkImportProducts
);

router.get('/export/all', 
  checkFeatureEnabled('import_export'),
  productController.exportProducts
);

// Product batch operations
router.post('/batch/update-prices',
  checkFeatureEnabled('batch_operations'),
  productController.batchUpdatePrices
);

export default router;
