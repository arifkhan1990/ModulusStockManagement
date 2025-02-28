import { Router } from 'express';
import { productController } from '../controllers';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { productValidator } from '../validators';

const router = Router();

// Create a new product
router.post(
  '/',
  requireAuth,
  validateRequest(productValidator.createProductSchema),
  productController.createProduct
);

// Get all products
router.get('/', requireAuth, productController.getProducts);

// Get a single product
router.get('/:id', requireAuth, productController.getProduct);

// Update a product
router.patch(
  '/:id',
  requireAuth,
  validateRequest(productValidator.updateProductSchema),
  productController.updateProduct
);

// Delete a product
router.delete('/:id', requireAuth, productController.deleteProduct);

export default router;