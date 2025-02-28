
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
import express from 'express';
import customerController from '../controllers/customer.controller';
import { requireAuth } from '../middleware/auth';
import { validateResource } from '../middleware/validator';
import { customerSchema } from '../validators/customer.validator';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Customer CRUD routes
router.post('/', validateResource(customerSchema), customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.put('/:id', validateResource(customerSchema.partial()), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Customer statistics
router.get('/stats/overview', customerController.getCustomerStats);

export default router;
