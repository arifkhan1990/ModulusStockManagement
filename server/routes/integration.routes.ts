
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { checkCompanyAccess } from '../middleware/tenant';
import { validateRequest } from '../middleware/validator';
import { integrationValidators } from '../validators/integration.validator';
import integrationController from '../controllers/integration.controller';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get available integrations
router.get('/available', checkCompanyAccess, integrationController.getAvailableIntegrations);

// Get all integrations for a company
router.get('/', checkCompanyAccess, integrationController.getIntegrations);

// Create a new integration
router.post('/', 
  checkCompanyAccess, 
  validateRequest(integrationValidators.createIntegration),
  integrationController.createIntegration
);

// Get a single integration
router.get('/:id', checkCompanyAccess, integrationController.getIntegration);

// Update an integration
router.put('/:id', 
  checkCompanyAccess, 
  validateRequest(integrationValidators.updateIntegration),
  integrationController.updateIntegration
);

// Delete an integration
router.delete('/:id', checkCompanyAccess, integrationController.deleteIntegration);

// Sync data with integration
router.post('/:id/sync', 
  checkCompanyAccess, 
  validateRequest(integrationValidators.syncIntegration),
  integrationController.syncIntegration
);

export default router;
