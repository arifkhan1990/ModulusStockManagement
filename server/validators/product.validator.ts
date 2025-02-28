
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Create a schema for product validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  costPrice: z.number().min(0, "Cost price must be a positive number").optional(),
  stockQuantity: z.number().min(0, "Stock quantity must be a positive number").default(0),
  lowStockThreshold: z.number().min(0).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.enum(['cm', 'in', 'm']).default('cm').optional()
  }).optional(),
  taxRate: z.number().min(0).default(0).optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).default('active').optional(),
  isDigital: z.boolean().default(false).optional(),
  isService: z.boolean().default(false).optional(),
  isActive: z.boolean().default(true).optional()
});

// Middleware to validate product data
export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    productSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
