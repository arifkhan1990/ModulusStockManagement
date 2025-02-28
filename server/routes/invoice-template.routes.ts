import express from 'express';
import invoiceTemplateController from '../controllers/invoice-template.controller';
import { requireAuth } from '../middleware/auth';
import { hasPermission } from '../middleware/rbac';

const router = express.Router();

// Protect all routes - require authentication
router.use(requireAuth);

// Get all templates
router.get('/', hasPermission('invoice:read'), invoiceTemplateController.getTemplates);

// Get a single template
router.get('/:id', hasPermission('invoice:read'), invoiceTemplateController.getTemplate);

// Create a new template
router.post('/', hasPermission('invoice:create'), invoiceTemplateController.createTemplate);

// Update a template
router.put('/:id', hasPermission('invoice:update'), invoiceTemplateController.updateTemplate);

// Delete a template
router.delete('/:id', hasPermission('invoice:delete'), invoiceTemplateController.deleteTemplate);

// Set a template as default
router.patch('/:id/set-default', hasPermission('invoice:update'), invoiceTemplateController.setDefaultTemplate);

export default router;