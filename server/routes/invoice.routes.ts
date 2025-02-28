import express from "express";
import invoiceController from "../controllers/invoice.controller";
import { requireAuth } from "../middleware/auth";
import { hasPermission } from "../middleware/rbac";

const router = express.Router();

// Protect all routes - require authentication
router.use(requireAuth);

// Get all invoices
router.get("/", hasPermission("invoice:read"), invoiceController.getInvoices);

// Get invoice statistics
router.get(
  "/statistics",
  hasPermission("invoice:read"),
  invoiceController.getInvoiceStatistics,
);

// Get a single invoice
router.get(
  "/:id",
  hasPermission("invoice:read"),
  invoiceController.getInvoice,
);

// Create a new invoice
router.post(
  "/",
  hasPermission("invoice:create"),
  invoiceController.createInvoice,
);

// Update an invoice
router.put(
  "/:id",
  hasPermission("invoice:update"),
  invoiceController.updateInvoice,
);

// Mark invoice as sent
router.patch(
  "/:id/mark-sent",
  hasPermission("invoice:update"),
  invoiceController.markInvoiceAsSent,
);

// Add payment to invoice
router.post(
  "/:id/payments",
  hasPermission("invoice:update"),
  invoiceController.addInvoicePayment,
);

// Cancel an invoice
router.patch(
  "/:id/cancel",
  hasPermission("invoice:update"),
  invoiceController.cancelInvoice,
);

export default router;