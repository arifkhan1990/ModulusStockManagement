
import express from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/product.controller';
import { validateRequest } from '../middleware/validate-request';
import { requireAuth } from '../middleware/auth';
import { checkFeatureEnabled } from '../middleware/feature-toggle';

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Get all products
router.get('/', 
  checkFeatureEnabled('inventory_management'),
  productController.getAllProducts
);

// Get a single product
router.get('/:id', 
  checkFeatureEnabled('inventory_management'),
  productController.getProductById
);

// Create a new product
router.post('/',
  checkFeatureEnabled('inventory_management'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  ],
  validateRequest,
  productController.createProduct
);

// Update a product
router.put('/:id',
  checkFeatureEnabled('inventory_management'),
  [
    body('name').optional().trim().notEmpty().withMessage('Product name is required'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  ],
  validateRequest,
  productController.updateProduct
);

// Delete a product
router.delete('/:id',
  checkFeatureEnabled('inventory_management'),
  productController.deleteProduct
);

export default router;
