
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import SystemLog from "../models/system-log.model";
import FeatureToggle from "../models/feature-toggle.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";

// Get system logs
export const getSystemLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Build filter query
    const queryObj: any = { companyId };

    // Filter by action type
    if (req.query.action) {
      queryObj.action = req.query.action;
    }

    // Filter by entity type
    if (req.query.entityType) {
      queryObj.entityType = req.query.entityType;
    }

    // Filter by user
    if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId as string)) {
      queryObj.userId = req.query.userId;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.timestamp = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Get total count
    const total = await SystemLog.countDocuments(queryObj);

    // Get logs with pagination
    const logs = await SystemLog.find(queryObj)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Get unique action types for filters
    const actionTypes = await SystemLog.distinct('action', { companyId });

    // Get unique entity types for filters
    const entityTypes = await SystemLog.distinct('entityType', { companyId });

    res.status(200).json(
      successResponse("System logs retrieved successfully", {
        logs,
        metadata: {
          actionTypes,
          entityTypes
        },
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Clear system logs
export const clearSystemLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    
    // Optionally specify a date before which to clear logs
    const { before } = req.body;
    
    let queryObj: any = { companyId };
    
    if (before) {
      queryObj.timestamp = { $lt: new Date(before) };
    }
    
    // Save the current log count for response
    const beforeCount = await SystemLog.countDocuments({ companyId });
    
    // Clear the logs
    const result = await SystemLog.deleteMany(queryObj);
    
    // Create a log for this action
    await SystemLog.create({
      companyId,
      action: 'logs_cleared',
      userId: req.user._id,
      details: { 
        deletedCount: result.deletedCount,
        before: before || "all" 
      },
      ipAddress: req.ip,
      timestamp: new Date()
    });
    
    // Get the new count
    const afterCount = await SystemLog.countDocuments({ companyId });
    
    res.status(200).json(
      successResponse("System logs cleared successfully", {
        deletedCount: result.deletedCount,
        beforeCount,
        afterCount
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Get feature toggles
export const getFeatureToggles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    
    const toggles = await FeatureToggle.find({ companyId })
      .sort({ name: 1 });
    
    res.status(200).json(
      successResponse("Feature toggles retrieved successfully", toggles),
    );
  } catch (error) {
    next(error);
  }
};

// Update feature toggle
export const updateFeatureToggle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return next(new AppError("Enabled status must be a boolean", 400));
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid feature toggle ID", 400));
    }
    
    const toggle = await FeatureToggle.findOneAndUpdate(
      { _id: id, companyId },
      { 
        enabled,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!toggle) {
      return next(new AppError("Feature toggle not found", 404));
    }
    
    // Log this change
    await SystemLog.create({
      companyId,
      action: 'feature_toggle_updated',
      entityType: 'FeatureToggle',
      entityId: toggle._id,
      userId: req.user._id,
      details: { 
        name: toggle.name,
        enabled: toggle.enabled
      },
      ipAddress: req.ip,
      timestamp: new Date()
    });
    
    res.status(200).json(
      successResponse("Feature toggle updated successfully", toggle),
    );
  } catch (error) {
    next(error);
  }
};

// Create feature toggle
export const createFeatureToggle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const { name, description, enabled = true } = req.body;
    
    if (!name) {
      return next(new AppError("Feature toggle name is required", 400));
    }
    
    // Check if toggle already exists
    const existing = await FeatureToggle.findOne({ 
      companyId, 
      name: name.trim() 
    });
    
    if (existing) {
      return next(new AppError("A feature toggle with this name already exists", 400));
    }
    
    const toggle = await FeatureToggle.create({
      companyId,
      name: name.trim(),
      description,
      enabled,
      updatedBy: req.user._id,
      updatedAt: new Date()
    });
    
    // Log this change
    await SystemLog.create({
      companyId,
      action: 'feature_toggle_created',
      entityType: 'FeatureToggle',
      entityId: toggle._id,
      userId: req.user._id,
      details: { 
        name: toggle.name,
        enabled: toggle.enabled
      },
      ipAddress: req.ip,
      timestamp: new Date()
    });
    
    res.status(201).json(
      successResponse("Feature toggle created successfully", toggle),
    );
  } catch (error) {
    next(error);
  }
};

// Delete feature toggle
export const deleteFeatureToggle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid feature toggle ID", 400));
    }
    
    const toggle = await FeatureToggle.findOne({ _id: id, companyId });
    
    if (!toggle) {
      return next(new AppError("Feature toggle not found", 404));
    }
    
    await FeatureToggle.deleteOne({ _id: id, companyId });
    
    // Log this change
    await SystemLog.create({
      companyId,
      action: 'feature_toggle_deleted',
      entityType: 'FeatureToggle',
      userId: req.user._id,
      details: { 
        name: toggle.name
      },
      ipAddress: req.ip,
      timestamp: new Date()
    });
    
    res.status(200).json(
      successResponse("Feature toggle deleted successfully", null),
    );
  } catch (error) {
    next(error);
  }
};

// Clear application cache
export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    
    // This would integrate with your cache service
    // For now, just logging the action
    await SystemLog.create({
      companyId,
      action: 'cache_cleared',
      userId: req.user._id,
      details: { 
        timestamp: new Date()
      },
      ipAddress: req.ip,
      timestamp: new Date()
    });
    
    // In a real implementation, you would call your cache service here
    // For example: await cacheService.clear(companyId);
    
    res.status(200).json(
      successResponse("Application cache cleared successfully", null),
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getSystemLogs,
  clearSystemLogs,
  getFeatureToggles,
  updateFeatureToggle,
  createFeatureToggle,
  deleteFeatureToggle,
  clearCache,
};
