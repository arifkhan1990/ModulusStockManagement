
import express from 'express';
import companyPreferenceController from '../controllers/company-preference.controller';
import { requireAuth } from '../middleware/auth';
import { requireCompanyAdmin } from '../middleware/rbac';
import companyPreferenceValidator from '../validators/company-preference.validator';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Initialize company preferences
router.post('/initialize', requireCompanyAdmin, companyPreferenceController.initializePreferences);

// Get company preferences
router.get('/', companyPreferenceController.getPreferences);

// Feature management
router.patch('/features/:featureKey/toggle', requireCompanyAdmin, companyPreferenceValidator.validateFeatureToggle, companyPreferenceController.toggleFeature);
router.patch('/features/:featureKey/priority', requireCompanyAdmin, companyPreferenceValidator.validateFeaturePriority, companyPreferenceController.updateFeaturePriority);
router.patch('/features/:featureKey/settings', requireCompanyAdmin, companyPreferenceValidator.validateFeatureSettings, companyPreferenceController.updateFeatureSettings);

// Branding and appearance
router.patch('/branding', requireCompanyAdmin, companyPreferenceValidator.validateBranding, companyPreferenceController.updateBranding);

// Notification channels
router.patch('/notifications', requireCompanyAdmin, companyPreferenceValidator.validateNotifications, companyPreferenceController.updateNotificationChannels);

// Sharing platforms
router.patch('/sharing', requireCompanyAdmin, companyPreferenceValidator.validateSharing, companyPreferenceController.updateSharingPlatforms);

// General settings
router.patch('/general', requireCompanyAdmin, companyPreferenceValidator.validateGeneralSettings, companyPreferenceController.updateGeneralSettings);

export default router;
