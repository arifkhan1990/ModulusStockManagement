import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, stockQuantity } = req.body;

  // Simple validation
  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (price === undefined || isNaN(parseFloat(price))) {
    return res.status(400).json({ message: 'Valid product price is required' });
  }

  if (stockQuantity === undefined || isNaN(parseInt(stockQuantity))) {
    return res.status(400).json({ message: 'Valid stock quantity is required' });
  }

  // If validation passes, continue to the next middleware
  next();
};