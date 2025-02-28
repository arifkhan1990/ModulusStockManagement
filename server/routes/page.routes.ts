
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { checkCompanyAccess } from '../middleware/tenant';
import { validateRequest } from '../middleware/validator';
import { pageValidators } from '../validators/page.validator';
import pageController from '../controllers/page.controller';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all pages
router.get('/', checkCompanyAccess, pageController.getPages);

// Create a new page
router.post('/', 
  checkCompanyAccess, 
  validateRequest(pageValidators.createPage),
  pageController.createPage
);

// Get a single page by ID
router.get('/:id', checkCompanyAccess, pageController.getPage);

// Get a public page by slug
router.get('/by-slug/:slug', checkCompanyAccess, pageController.getPublicPageBySlug);

// Update a page
router.put('/:id', 
  checkCompanyAccess, 
  validateRequest(pageValidators.updatePage),
  pageController.updatePage
);

// Delete a page
router.delete('/:id', checkCompanyAccess, pageController.deletePage);

export default router;
