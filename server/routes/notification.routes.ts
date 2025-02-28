
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { requireCompany } from '../middleware/tenant';
import notificationController from '../controllers/notification.controller';
import notificationValidator from '../validators/notification.validator';

const router = express.Router();

// Apply middleware
router.use(requireAuth);
router.use(requireCompany);

// Create a new notification
router.post(
  '/',
  notificationValidator.createNotificationValidator,
  notificationController.createNotification
);

// Get all notifications with pagination and filters
router.get(
  '/',
  notificationValidator.getNotificationsValidator,
  notificationController.getNotifications
);

// Get a single notification
router.get(
  '/:id',
  notificationValidator.markAsReadValidator, // Reuse ID validator
  notificationController.getNotification
);

// Mark notification as read
router.patch(
  '/:id/read',
  notificationValidator.markAsReadValidator,
  notificationController.markAsRead
);

// Mark multiple notifications as read
router.post(
  '/read',
  notificationValidator.markMultipleAsReadValidator,
  notificationController.markMultipleAsRead
);

// Delete a notification
router.delete(
  '/:id',
  notificationValidator.markAsReadValidator, // Reuse ID validator
  notificationController.deleteNotification
);

// Get notification preferences
router.get(
  '/preferences',
  notificationController.getNotificationPreferences
);

// Update notification preferences
router.patch(
  '/preferences/:id',
  notificationValidator.updateNotificationPreferenceValidator,
  notificationController.updateNotificationPreferences
);

// Create default notification preferences
router.post(
  '/preferences/default',
  notificationController.createDefaultPreferences
);

// Get notification statistics
router.get(
  '/statistics',
  notificationController.getNotificationStatistics
);

export default router;
