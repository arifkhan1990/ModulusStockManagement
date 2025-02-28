import express from 'express';
import * as pageController from '../controllers/page.controller';
import { requireAuth } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';
import validateResource from '../middleware/validator';
import { pageValidators } from '../validators/page.validator';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all pages
router.get('/', tenantMiddleware, pageController.getPages);

// Create a new page
router.post('/', 
  tenantMiddleware, 
  validateResource(pageValidators.createPage),
  pageController.createPage
);

// Get a single page by ID
router.get('/:id', tenantMiddleware, pageController.getPage);

// Get a public page by slug
router.get('/by-slug/:slug', tenantMiddleware, pageController.getPublicPageBySlug);

// Update a page
router.put('/:id', 
  tenantMiddleware, 
  validateResource(pageValidators.updatePage),
  pageController.updatePage
);

// Delete a page
router.delete('/:id', tenantMiddleware, pageController.deletePage);

export default router;