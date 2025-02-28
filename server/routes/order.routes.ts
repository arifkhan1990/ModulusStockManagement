
import express from 'express';
import * as orderController from '../controllers/order.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Order routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/statistics', orderController.getOrderStatistics);
router.get('/:id', orderController.getOrder);
router.patch('/:id', orderController.updateOrder);
router.post('/:id/cancel', orderController.cancelOrder);

export default router;
