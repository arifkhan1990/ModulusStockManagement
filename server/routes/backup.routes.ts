
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { checkCompanyAccess } from '../middleware/tenant';
import { validateRequest } from '../middleware/validator';
import { backupValidators } from '../validators/backup.validator';
import backupController from '../controllers/backup.controller';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all backups
router.get('/', checkCompanyAccess, backupController.getBackups);

// Create a new backup
router.post('/', 
  checkCompanyAccess, 
  validateRequest(backupValidators.createBackup),
  backupController.createBackup
);

// Get a single backup
router.get('/:id', checkCompanyAccess, backupController.getBackup);

// Restore from a backup
router.post('/:id/restore', 
  checkCompanyAccess, 
  validateRequest(backupValidators.restoreBackup),
  backupController.restoreBackup
);

// Delete a backup
router.delete('/:id', checkCompanyAccess, backupController.deleteBackup);

export default router;
