import express from "express";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { tenantMiddleware } from "../middleware/tenant";
import sharingController from "../controllers/sharing.controller";
import sharingValidator from "../validators/sharing.validator";

const router = express.Router();

// Public routes (no auth required)
// Get shared document by access token
router.get("/access/:accessToken", sharingController.getSharedDocument);

// Download a document (public route)
router.get("/download/:id", sharingController.downloadDocument);

// Protected routes
router.use(requireAuth);
router.use(tenantMiddleware);

// Create a new sharing link
router.post(
  "/",
  sharingValidator.createSharingValidator,
  sharingController.createSharing,
);

// Get all sharing links
router.get(
  "/",
  sharingValidator.getSharingsValidator,
  sharingController.getSharings,
);

// Get a single sharing link
router.get(
  "/:id",
  sharingValidator.revokeSharingValidator, // Reuse ID validator
  sharingController.getSharing,
);

// Revoke a sharing link
router.patch(
  "/:id/revoke",
  sharingValidator.revokeSharingValidator,
  sharingController.revokeSharing,
);

// Create a document download link
router.post(
  "/download",
  sharingValidator.createDownloadValidator,
  sharingController.createDownload,
);

// Get download statistics
router.get("/download/statistics", sharingController.getDownloadStatistics);

export default router;
