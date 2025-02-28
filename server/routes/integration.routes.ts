import express from "express";
import { requireAuth } from "../middleware/auth";
import { tenantMiddleware } from "../middleware/tenant";
import { validateResource } from "../middleware/validator";
import { integrationValidators } from "../validators/integration.validator";
import integrationController from "../controllers/integration.controller";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get available integrations
router.get(
  "/available",
  tenantMiddleware,
  integrationController.getAvailableIntegrations,
);

// Get all integrations for a company
router.get("/", tenantMiddleware, integrationController.getIntegrations);

// Create a new integration
router.post(
  "/",
  tenantMiddleware,
  validateResource(integrationValidators.createIntegration),
  integrationController.createIntegration,
);

// Get a single integration
router.get("/:id", tenantMiddleware, integrationController.getIntegration);

// Update an integration
router.put(
  "/:id",
  tenantMiddleware,
  validateResource(integrationValidators.updateIntegration),
  integrationController.updateIntegration,
);

// Delete an integration
router.delete(
  "/:id",
  tenantMiddleware,
  integrationController.deleteIntegration,
);

// Sync data with integration
router.post(
  "/:id/sync",
  tenantMiddleware,
  validateResource(integrationValidators.syncIntegration),
  integrationController.syncIntegration,
);

export default router;
