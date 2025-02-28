import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import SystemLog from "../models/system-log.model";
import FeatureToggle from "../models/feature-toggle.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";
import { roles } from "../middleware/rbac";

// Get system logs with filtering and pagination
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

    // Check if user is admin
    if (req.user.role !== roles.ADMIN) {
      return next(new AppError("Not authorized to view system logs", 403));
    }

    // Build query filters
    const queryObj: any = { companyId };

    // Filter by action
    if (req.query.action) {
      queryObj.action = req.query.action;
    }

    // Filter by entity
    if (req.query.entity) {
      queryObj.entity = req.query.entity;
    }

    // Filter by user
    if (
      req.query.userId &&
      mongoose.Types.ObjectId.isValid(req.query.userId as string)
    ) {
      queryObj.userId = req.query.userId;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Count total logs
    const total = await SystemLog.countDocuments(queryObj);

    // Get logs with pagination
    const logs = await SystemLog.find(queryObj)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse("System logs retrieved successfully", {
        logs,
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

// Get all feature toggles for a company
export const getFeatureToggles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;

    // Check if user is admin
    if (req.user.role !== roles.ADMIN) {
      return next(new AppError("Not authorized to view feature toggles", 403));
    }

    const featureToggles = await FeatureToggle.find({ companyId });

    res
      .status(200)
      .json(
        successResponse(
          "Feature toggles retrieved successfully",
          featureToggles,
        ),
      );
  } catch (error) {
    next(error);
  }
};

// Update a feature toggle
export const updateFeatureToggle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    // Check if user is admin
    if (req.user.role !== roles.ADMIN) {
      return next(
        new AppError("Not authorized to update feature toggles", 403),
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid feature toggle ID", 400));
    }

    // Only allow updating enabled status and configuration
    const updates = {
      enabled: req.body.enabled,
      configuration: req.body.configuration,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    };

    const featureToggle = await FeatureToggle.findOneAndUpdate(
      { _id: id, companyId },
      updates,
      { new: true, runValidators: true },
    );

    if (!featureToggle) {
      return next(new AppError("Feature toggle not found", 404));
    }

    // Log the feature toggle update
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: "update",
      entity: "feature_toggle",
      entityId: featureToggle._id,
      details: {
        feature: featureToggle.feature,
        enabled: featureToggle.enabled,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res
      .status(200)
      .json(
        successResponse("Feature toggle updated successfully", featureToggle),
      );
  } catch (error) {
    next(error);
  }
};

// Clear cache (this would be implemented based on your caching strategy)
export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;

    // Check if user is admin
    if (req.user.role !== roles.ADMIN) {
      return next(new AppError("Not authorized to clear cache", 403));
    }

    // Placeholder for cache clearing logic
    // This would depend on your caching implementation

    // Log the cache clear action
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: "clear_cache",
      entity: "system",
      details: { cacheType: req.query.type || "all" },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json(successResponse("Cache cleared successfully", null));
  } catch (error) {
    next(error);
  }
};

// Get system statistics
export const getSystemStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;

    // Check if user is admin
    if (req.user.role !== roles.ADMIN) {
      return next(
        new AppError("Not authorized to view system statistics", 403),
      );
    }

    // Recent activity logs (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentLogs = await SystemLog.find({
      companyId,
      createdAt: { $gte: oneDayAgo },
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // Activity count by action type
    const actionCounts = await SystemLog.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: oneDayAgo },
        },
      },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Activity count by entity type
    const entityCounts = await SystemLog.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: oneDayAgo },
        },
      },
      { $group: { _id: "$entity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Most active users
    const activeUsers = await SystemLog.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: oneDayAgo },
        },
      },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          count: 1,
          name: "$user.name",
          email: "$user.email",
        },
      },
    ]);

    res.status(200).json(
      successResponse("System statistics retrieved successfully", {
        recentLogs,
        actionCounts,
        entityCounts,
        activeUsers,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getSystemLogs,
  getFeatureToggles,
  updateFeatureToggle,
  clearCache,
  getSystemStats,
};
