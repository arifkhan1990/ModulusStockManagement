
import express from 'express';
import paymentWebhookController from '../controllers/payment-webhook.controller';

const router = express.Router();

// Webhook routes do not use auth middleware to allow external services to call them
router.post('/stripe', express.raw({ type: 'application/json' }), paymentWebhookController.stripeWebhook);
router.post('/paypal', paymentWebhookController.paypalWebhook);

export default router;
