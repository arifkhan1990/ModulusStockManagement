
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Notification from '../models/notification.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Get all notifications for a user
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const queryObj: any = { companyId, userId };

    // Filter by read status if provided
    if (req.query.isRead !== undefined) {
      queryObj.isRead = req.query.isRead === 'true';
    }

    // Filter by type if provided
    if (req.query.type) {
      queryObj.type = req.query.type;
    }

    // Count total notifications
    const total = await Notification.countDocuments(queryObj);

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({ 
      companyId, 
      userId, 
      isRead: false 
    });

    // Fetch notifications with pagination
    const notifications = await Notification.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse('Notifications retrieved successfully', {
        notifications,
        unreadCount,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid notification ID', 400));
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, companyId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json(successResponse('Notification marked as read', notification));
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { companyId, userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json(
      successResponse('All notifications marked as read', {
        count: result.modifiedCount
      })
    );
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid notification ID', 400));
    }

    const notification = await Notification.findOneAndDelete({ 
      _id: id, 
      companyId, 
      userId 
    });

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json(successResponse('Notification deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

// Delete all read notifications
export const deleteAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const userId = req.user._id;

    const result = await Notification.deleteMany({ 
      companyId, 
      userId, 
      isRead: true 
    });

    res.status(200).json(
      successResponse('All read notifications deleted', {
        count: result.deletedCount
      })
    );
  } catch (error) {
    next(error);
  }
};

// Update notification preferences
export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return next(new AppError('Invalid preferences data', 400));
    }

    // This would typically update a user preferences collection/document
    // For now, we'll just return a success response
    res.status(200).json(
      successResponse('Notification preferences updated successfully', {
        preferences
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  updatePreferences
};
