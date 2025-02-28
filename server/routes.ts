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
  insertInvoiceSchema,
  insertInvoiceTemplateSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { requireAuth } from "./middleware/auth";
import { healthCheck, detailedHealthCheck, readyCheck } from './middleware/health';
import productRoutes from './routes/product.routes';
import inventoryRoutes from './routes/inventory.routes';
import locationRoutes from './routes/location.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import customerRoutes from './routes/customer.routes';
import invoiceRoutes from './routes/invoice.routes';
import invoiceTemplateRoutes from './routes/invoice-template.routes';
import adminRoutes from './routes/admin.routes';
import pageRoutes from './routes/page.routes';
import supportTicketRoutes from './routes/support-ticket.routes';
import backupRoutes from './routes/backup.routes';
import notificationRoutes from './routes/notification.routes';
import integrationRoutes from './routes/integration.routes';
import { tenantMiddleware } from './middleware/tenant';
import { authRateLimit } from './middleware/rate-limit';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Apply tenant middleware
  app.use('/api', tenantMiddleware);

  // Health check routes for load balancers
  app.get('/health', healthCheck);
  app.get('/health/detailed', detailedHealthCheck);
  app.get('/health/ready', readyCheck);

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

  // Authentication rate limiter
  app.use('/api/auth', authRateLimit);

  // Modular API routes
  app.use('/api/products', productRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/invoices', invoiceRoutes);
  app.use('/api/invoice-templates', invoiceTemplateRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/pages', pageRoutes);
  app.use('/api/support-tickets', supportTicketRoutes);
  app.use('/api/backups', backupRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/integrations', integrationRoutes);

  // Legacy routes for backward compatibility
  // These will be migrated to the modular structure over time
  app.use("/api/inventory", requireAuth);

  // Location routes
  app.get("/api/legacy/locations", requireAuth, async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.get("/api/legacy/locations/:id", requireAuth, async (req, res) => {
    try {
      const location = await storage.getLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  app.post("/api/legacy/locations", requireAuth, async (req, res) => {
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

  app.put("/api/legacy/locations/:id", requireAuth, async (req, res) => {
    try {
      const locationData = insertLocationSchema.partial().parse(req.body);
      const result = await storage.updateLocation(req.params.id, locationData);
      if (!result) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: "Invalid location data", errors: err.errors });
      } else {
        res.status(500).json({ message: "Failed to update location" });
      }
    }
  });

  app.delete("/api/legacy/locations/:id", requireAuth, async (req, res) => {
    try {
      const result = await storage.deleteLocation(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json({ message: "Location deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  // Create HTTP server instance
  return createServer(app);
}