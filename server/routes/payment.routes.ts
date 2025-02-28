
import express from 'express';
import { isAuthenticated, hasPermission } from '../auth';
import * as paymentController from '../controllers/payment.controller';

const router = express.Router();

// Create a new payment
router.post('/', 
  isAuthenticated, 
  hasPermission('payments:create'), 
  paymentController.createPayment
);

// Get all payments with filtering
router.get('/', 
  isAuthenticated, 
  hasPermission('payments:view'), 
  paymentController.getPayments
);

// Get payment by ID
router.get('/:id', 
  isAuthenticated, 
  hasPermission('payments:view'), 
  paymentController.getPaymentById
);

// Update payment status (for refunds, etc.)
router.patch('/:id/status', 
  isAuthenticated, 
  hasPermission('payments:update'), 
  paymentController.updatePaymentStatus
);

// Process a Stripe payment
router.post('/process/stripe', 
  isAuthenticated, 
  paymentController.processStripePayment
);

// Process a bKash payment
router.post('/process/bkash', 
  isAuthenticated, 
  paymentController.processBkashPayment
);

export default router;
import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Payment routes
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getPayments);
router.get('/statistics', paymentController.getPaymentStatistics);
router.get('/:id', paymentController.getPayment);
router.patch('/:id', paymentController.updatePayment);

export default router;
