
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertSupplierSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await storage.getSuppliers();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await storage.getSupplier(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch supplier" });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = insertSupplierSchema.parse(req.body);
    const result = await storage.createSupplier(supplier);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid supplier data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to create supplier" });
    }
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplierData = insertSupplierSchema.partial().parse(req.body);
    const result = await storage.updateSupplier(req.params.id, supplierData);
    if (!result) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid supplier data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to update supplier" });
    }
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const result = await storage.deleteSupplier(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete supplier" });
  }
};
