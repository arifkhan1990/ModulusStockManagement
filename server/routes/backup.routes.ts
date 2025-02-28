import express from "express";
import { requireAuth } from "../middleware/auth";
import { tenantMiddleware } from "../middleware/tenant";
import { validateResource } from "../middleware/validator";
import { backupValidators } from "../validators/backup.validator";
import backupController from "../controllers/backup.controller";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all backups
router.get("/", tenantMiddleware, backupController.getBackups);

// Create a new backup
router.post(
  "/",
  tenantMiddleware,
  validateResource(backupValidators.createBackup),
  backupController.createBackup,
);

// Get a single backup
router.get("/:id", tenantMiddleware, backupController.getBackup);

// Restore from a backup
router.post(
  "/:id/restore",
  tenantMiddleware,
  validateResource(backupValidators.restoreBackup),
  backupController.restoreBackup,
);

// Delete a backup
router.delete("/:id", tenantMiddleware, backupController.deleteBackup);

export default router;
