
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { checkCompanyAccess } from '../middleware/tenant';
import { validateRequest } from '../middleware/validator';
import { notificationValidators } from '../validators/notification.validator';
import notificationController from '../controllers/notification.controller';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all notifications for current user
router.get('/', checkCompanyAccess, notificationController.getNotifications);

// Mark notification as read
router.patch('/:id/read', 
  checkCompanyAccess, 
  notificationController.markAsRead
);

// Mark all notifications as read
router.patch('/read-all', 
  checkCompanyAccess, 
  notificationController.markAllAsRead
);

// Delete a notification
router.delete('/:id', 
  checkCompanyAccess, 
  notificationController.deleteNotification
);

// Delete all read notifications
router.delete('/read', 
  checkCompanyAccess, 
  notificationController.deleteAllRead
);

// Update notification preferences
router.put('/preferences', 
  checkCompanyAccess, 
  validateRequest(notificationValidators.updatePreferences),
  notificationController.updatePreferences
);

export default router;
