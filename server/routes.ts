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

// Middleware to ensure user is authenticated
function requireAuth(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

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
      const movement = insertStockMovementSchema.parse({
        ...req.body,
        createdBy: req.user!.id,
      });
      const result = await storage.createStockMovement(movement);
      res.json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid stock movement data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to create stock movement" });
      }
    }
  });

  return createServer(app);
}