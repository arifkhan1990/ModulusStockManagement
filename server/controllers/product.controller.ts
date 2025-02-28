
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertProductSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await storage.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = insertProductSchema.parse(req.body);
    const result = await storage.createProduct(product);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid product data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to create product" });
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productData = insertProductSchema.partial().parse(req.body);
    const result = await storage.updateProduct(req.params.id, productData);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid product data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to update product" });
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await storage.deleteProduct(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
