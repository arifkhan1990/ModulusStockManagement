
import express from 'express';
import * as customerController from '../controllers/customer.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Customer routes
router.post('/', customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/types', customerController.getCustomerTypes);
router.get('/:id', customerController.getCustomer);
router.patch('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
