
import express from 'express';
import { requireAuth } from '../middleware/auth';
import tenantMiddleware from '../middleware/tenant';
import { validateRequest } from '../middleware/validator';
import { ticketValidators } from '../validators/support-ticket.validator';
import supportTicketController from '../controllers/support-ticket.controller';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all tickets
router.get('/', checkCompanyAccess, supportTicketController.getTickets);

// Create a new ticket
router.post('/', 
  checkCompanyAccess, 
  validateRequest(ticketValidators.createTicket),
  supportTicketController.createTicket
);

// Get a single ticket
router.get('/:id', checkCompanyAccess, supportTicketController.getTicket);

// Add a message to a ticket
router.post('/:id/messages', 
  checkCompanyAccess, 
  validateRequest(ticketValidators.addMessage),
  supportTicketController.addMessage
);

// Update ticket status
router.patch('/:id/status', 
  checkCompanyAccess, 
  validateRequest(ticketValidators.updateStatus),
  supportTicketController.updateTicketStatus
);

export default router;
