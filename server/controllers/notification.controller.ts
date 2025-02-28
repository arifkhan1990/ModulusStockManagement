
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Notification from '../models/notification.model';
import NotificationPreference from '../models/notification-preference.model';
import Integration from '../models/integration.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';
import { notificationService } from '../services/notification.service';

// Create a new notification
export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;

    // Extract notification data from request
    const notificationData = {
      ...req.body,
      companyId,
      userId: req.user._id,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create notification
    const notification = await Notification.create(notificationData);

    // Queue the notification for processing
    await notificationService.queueNotification(notification._id);

    res.status(201).json(successResponse('Notification created successfully', notification));
  } catch (error) {
    next(error);
  }
};

// Get all notifications for a company with pagination and filters
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by recipient type if provided
    if (req.query.recipientType) {
      queryObj.recipientType = req.query.recipientType;
    }

    // Filter by channel if provided
    if (req.query.channel) {
      queryObj.channel = req.query.channel;
    }

    // Filter by event type if provided
    if (req.query.eventType) {
      queryObj.eventType = req.query.eventType;
    }

    // Filter by status if provided
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by read status if provided
    if (req.query.isRead !== undefined) {
      queryObj.isRead = req.query.isRead === 'true';
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }

    // Get total count
    const total = await Notification.countDocuments(queryObj);

    // Get notifications with pagination
    const notifications = await Notification.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse('Notifications retrieved successfully', {
        notifications,
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

// Get a single notification
export const getNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid notification ID', 400));
    }

    const notification = await Notification.findOne({ _id: id, companyId });

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json(successResponse('Notification retrieved successfully', notification));
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid notification ID', 400));
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, companyId },
      { 
        isRead: true, 
        readAt: new Date(),
        updatedAt: new Date()
      },
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

// Mark multiple notifications as read
export const markMultipleAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;
    const companyId = req.company._id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new AppError('Invalid notification IDs', 400));
    }

    // Validate all IDs
    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError(`Invalid notification ID: ${id}`, 400));
      }
    }

    const result = await Notification.updateMany(
      { 
        _id: { $in: ids }, 
        companyId 
      },
      { 
        isRead: true, 
        readAt: new Date(),
        updatedAt: new Date()
      }
    );

    res.status(200).json(
      successResponse('Notifications marked as read', {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      })
    );
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid notification ID', 400));
    }

    const notification = await Notification.findOneAndDelete({ _id: id, companyId });

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(200).json(successResponse('Notification deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

// Get notification preferences
export const getNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    
    // Get all preferences for this company
    const preferences = await NotificationPreference.find({ companyId });
    
    res.status(200).json(successResponse('Notification preferences retrieved successfully', preferences));
  } catch (error) {
    next(error);
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid preference ID', 400));
    }
    
    const updates = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const preference = await NotificationPreference.findOneAndUpdate(
      { _id: id, companyId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!preference) {
      return next(new AppError('Notification preference not found', 404));
    }
    
    res.status(200).json(successResponse('Notification preference updated successfully', preference));
  } catch (error) {
    next(error);
  }
};

// Create default notification preferences for all event types
export const createDefaultPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    const userId = req.user._id;
    
    // Define all event types
    const eventTypes = [
      'product_added',
      'order_placed',
      'order_shipped',
      'order_delivered',
      'payment_received',
      'payment_due',
      'payment_overdue',
      'invoice_created',
      'invoice_shared',
      'report_generated',
      'report_shared',
      'low_stock',
      'support_ticket_created',
      'support_ticket_resolved'
    ];
    
    // Define recipient types
    const recipientTypes = ['subscriber', 'customer', 'employee'];
    
    // Create default preferences for each event type and recipient type
    const preferences = [];
    
    for (const eventType of eventTypes) {
      for (const recipientType of recipientTypes) {
        // Check if a preference already exists
        const existingPref = await NotificationPreference.findOne({
          companyId,
          eventType,
          recipientType
        });
        
        if (!existingPref) {
          // Create new preference with default settings
          const newPref = await NotificationPreference.create({
            companyId,
            userId,
            eventType,
            recipientType,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          preferences.push(newPref);
        }
      }
    }
    
    res.status(201).json(
      successResponse('Default notification preferences created', {
        count: preferences.length,
        preferences
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get notification statistics
export const getNotificationStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    
    // Default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Override dates if provided
    if (req.query.startDate) {
      startDate.setTime(new Date(req.query.startDate as string).getTime());
    }
    
    if (req.query.endDate) {
      endDate.setTime(new Date(req.query.endDate as string).getTime());
    }
    
    // Get counts by status
    const statusCounts = await Notification.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get counts by channel
    const channelCounts = await Notification.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$channel',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get counts by event type
    const eventTypeCounts = await Notification.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get daily notification counts
    const dailyCounts = await Notification.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json(
      successResponse('Notification statistics retrieved successfully', {
        statusCounts,
        channelCounts,
        eventTypeCounts,
        dailyCounts
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  markMultipleAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  createDefaultPreferences,
  getNotificationStatistics
};
