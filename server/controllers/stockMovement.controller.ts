
import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertStockMovementSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const createStockMovement = async (req: Request, res: Response) => {
  try {
    // Handle adjustments specially (set toLocationId to null for adjustments)
    let movementData = { ...req.body, createdBy: req.user!.id };
    
    if (movementData.type === 'adjustment') {
      // For adjustments, we don't need a toLocationId
      movementData.toLocationId = undefined;
    }
    
    const movement = insertStockMovementSchema.parse(movementData);
    
    // Create the stock movement
    const result = await storage.createStockMovement(movement);
    
    // Update inventory based on the movement type
    if (movement.type === 'transfer') {
      // For transfers, reduce from source and add to destination
      await updateInventoryForTransfer(movement);
    } else if (movement.type === 'adjustment') {
      // For adjustments, just reduce from the source
      await updateInventoryForAdjustment(movement);
    }
    
    res.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "Invalid stock movement data", errors: err.errors });
    } else {
      console.error(err);
      res.status(500).json({ message: "Failed to create stock movement" });
    }
  }
};

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const productId = req.query.productId ? String(req.query.productId) : undefined;
    const movements = productId
      ? await storage.getStockMovements(productId)
      : await storage.getAllStockMovements();
    res.json(movements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
};

// Helper function to update inventory for transfers
async function updateInventoryForTransfer(movement: any) {
  const { productId, fromLocationId, toLocationId, quantity } = movement;
  
  // Check if we have enough stock at the source location
  const sourceInventory = await storage.getInventory(productId, fromLocationId);
  
  if (!sourceInventory || sourceInventory.quantity < quantity) {
    throw new Error("Insufficient stock at source location");
  }
  
  // Reduce from source location
  await storage.updateInventory(sourceInventory.id, {
    quantity: sourceInventory.quantity - quantity
  });
  
  // Add to destination location
  const destInventory = await storage.getInventory(productId, toLocationId);
  
  if (destInventory) {
    // Update existing inventory
    await storage.updateInventory(destInventory.id, {
      quantity: destInventory.quantity + quantity
    });
  } else {
    // Create new inventory record
    await storage.createInventory({
      productId,
      locationId: toLocationId,
      quantity
    });
  }
}

// Helper function to update inventory for adjustments
async function updateInventoryForAdjustment(movement: any) {
  const { productId, fromLocationId, quantity } = movement;
  
  // Check if we have enough stock at the source location
  const inventory = await storage.getInventory(productId, fromLocationId);
  
  if (!inventory) {
    throw new Error("No inventory found for the product at the specified location");
  }
  
  // Update inventory
  await storage.updateInventory(inventory.id, {
    quantity: inventory.quantity - quantity
  });
}
