
import express from 'express';
import invoiceTemplateController from '../controllers/invoice-template.controller';
import { requireAuth } from '../middleware/auth';
import { checkPermission } from '../middleware/rbac';

const router = express.Router();

// Protect all routes - require authentication
router.use(requireAuth);

// Get all templates
router.get('/', checkPermission('invoice:read'), invoiceTemplateController.getTemplates);

// Get a single template
router.get('/:id', checkPermission('invoice:read'), invoiceTemplateController.getTemplate);

// Create a new template
router.post('/', checkPermission('invoice:create'), invoiceTemplateController.createTemplate);

// Update a template
router.put('/:id', checkPermission('invoice:update'), invoiceTemplateController.updateTemplate);

// Delete a template
router.delete('/:id', checkPermission('invoice:delete'), invoiceTemplateController.deleteTemplate);

// Set a template as default
router.patch('/:id/set-default', checkPermission('invoice:update'), invoiceTemplateController.setDefaultTemplate);

export default router;
