
import express from 'express';
import invoiceController from '../controllers/invoice.controller';
import { requireAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = express.Router();

// Protect all routes - require authentication
router.use(requireAuth);

// Get all invoices
router.get('/', checkPermission('invoice:read'), invoiceController.getInvoices);

// Get invoice statistics
router.get('/statistics', checkPermission('invoice:read'), invoiceController.getInvoiceStatistics);

// Get a single invoice
router.get('/:id', checkPermission('invoice:read'), invoiceController.getInvoice);

// Create a new invoice
router.post('/', checkPermission('invoice:create'), invoiceController.createInvoice);

// Update an invoice
router.put('/:id', checkPermission('invoice:update'), invoiceController.updateInvoice);

// Mark invoice as sent
router.patch('/:id/mark-sent', checkPermission('invoice:update'), invoiceController.markInvoiceAsSent);

// Add payment to invoice
router.post('/:id/payments', checkPermission('invoice:update'), invoiceController.addInvoicePayment);

// Cancel an invoice
router.patch('/:id/cancel', checkPermission('invoice:update'), invoiceController.cancelInvoice);

export default router;
