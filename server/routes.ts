import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertDemoRequestSchema,
  insertLocationSchema,
  insertSupplierSchema,
  insertProductSchema,
  insertInventorySchema,
  insertStockMovementSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { requireAuth } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Demo request route
  app.post("/api/demo-request", async (req, res) => {
    try {
      const demoRequest = insertDemoRequestSchema.parse(req.body);
      const result = await storage.createDemoRequest(demoRequest);
      res.json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Protected routes
  app.use("/api/inventory", requireAuth);

  // Location routes
  app.get("/api/locations", requireAuth, async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.post("/api/locations", requireAuth, async (req, res) => {
    try {
      const location = insertLocationSchema.parse(req.body);
      const result = await storage.createLocation(location);
      res.json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid location data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to create location" });
      }
    }
  });

  // Supplier routes
  app.get("/api/suppliers", requireAuth, async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", requireAuth, async (req, res) => {
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
  });

  // Product routes
  app.get("/api/products", requireAuth, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", requireAuth, async (req, res) => {
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
  });

  // Inventory routes
  app.get("/api/inventory/:locationId", requireAuth, async (req, res) => {
    try {
      const locationId = parseInt(req.params.locationId);
      const inventory = await storage.getInventoryByLocation(locationId);
      res.json(inventory);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post("/api/stock-movements", requireAuth, async (req, res) => {
    try {
      // Handle adjustments specially (set toLocationId to null for adjustments)
      let movementData = { ...req.body, createdBy: req.user!.id };
      
      if (movementData.type === 'adjustment') {
        // For adjustments, we don't need a toLocationId
        movementData.toLocationId = null;
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
  });
  
  // Get all stock movements or filter by product
  app.get("/api/stock-movements", requireAuth, async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const movements = productId
        ? await storage.getStockMovements(productId)
        : await storage.getAllStockMovements();
      res.json(movements);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch stock movements" });
    }
  });
  
  // Helper function to update inventory for transfers
  async function updateInventoryForTransfer(movement) {
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
  async function updateInventoryForAdjustment(movement) {
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

  return createServer(app);
}