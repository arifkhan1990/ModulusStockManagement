
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertInventorySchema } from '@shared/schema';
import { ZodError } from 'zod';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const locationId = req.params.locationId;
    const inventory = await storage.getInventoryByLocation(locationId);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

export const createInventory = async (req: Request, res: Response) => {
  try {
    const inventoryData = insertInventorySchema.parse(req.body);
    const result = await storage.createInventory(inventoryData);
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid inventory data", errors: err.errors });
    } else {
      res.status(500).json({ message: "Failed to create inventory" });
    }
  }
};
