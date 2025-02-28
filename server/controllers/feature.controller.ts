
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Feature from '../models/feature.model';
import CompanyPreference from '../models/company-preference.model';
import AuditLog from '../models/audit-log.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Create a new feature
export const createFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingFeature = await Feature.findOne({ key: req.body.key });
    if (existingFeature) {
      return next(new AppError('Feature with this key already exists', 400));
    }

    const feature = await Feature.create({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Log the action
    await AuditLog.create({
      userId: req.user._id,
      userType: 'admin',
      action: 'feature_created',
      entityType: 'feature',
      entityId: feature._id.toString(),
      changes: [
        {
          field: 'all',
          newValue: feature
        }
      ],
      metadata: { featureKey: feature.key },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    });

    res.status(201).json(successResponse('Feature created successfully', feature));
  } catch (error) {
    next(error);
  }
};

// Get all features with filtering
export const getFeatures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const queryObj: any = {};

    // Filter by category
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Filter by status
    if (req.query.isEnabled !== undefined) {
      queryObj.isEnabled = req.query.isEnabled === 'true';
    }

    // Filter by subscription tier
    if (req.query.tier) {
      queryObj.subscriptionTiers = req.query.tier;
    }

    // Search by name or key
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { key: searchRegex },
        { description: searchRegex }
      ];
    }

    // Get total count
    const total = await Feature.countDocuments(queryObj);

    // Get features with pagination
    const features = await Feature.find(queryObj)
      .sort({ category: 1, order: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse('Features retrieved successfully', {
        features,
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

// Get a single feature
export const getFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Allow lookup by ID or key
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { key: id };

    const feature = await Feature.findOne(query);

    if (!feature) {
      return next(new AppError('Feature not found', 404));
    }

    res.status(200).json(successResponse('Feature retrieved successfully', feature));
  } catch (error) {
    next(error);
  }
};

// Update a feature
export const updateFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get the feature before update for audit log
    const existingFeature = await Feature.findById(id);
    if (!existingFeature) {
      return next(new AppError('Feature not found', 404));
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    // Don't allow changing the key if it's already in use
    if (req.body.key && req.body.key !== existingFeature.key) {
      const keyExists = await Feature.findOne({ key: req.body.key });
      if (keyExists) {
        return next(new AppError('Feature with this key already exists', 400));
      }
    }

    const feature = await Feature.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Create changes array for audit log
    const changes = Object.keys(req.body).map(field => ({
      field,
      oldValue: (existingFeature as any)[field],
      newValue: (feature as any)[field]
    }));

    // Log the action
    await AuditLog.create({
      userId: req.user._id,
      userType: 'admin',
      action: 'feature_updated',
      entityType: 'feature',
      entityId: feature?._id.toString(),
      changes,
      metadata: { featureKey: feature?.key },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    });

    res.status(200).json(successResponse('Feature updated successfully', feature));
  } catch (error) {
    next(error);
  }
};

// Delete a feature
export const deleteFeature = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const feature = await Feature.findById(id);
    if (!feature) {
      return next(new AppError('Feature not found', 404));
    }

    // Check if any company is using this feature
    const companyUsingFeature = await CompanyPreference.findOne({
      'features.key': feature.key
    });

    if (companyUsingFeature) {
      return next(new AppError('Cannot delete feature as it is in use by subscribers', 400));
    }

    // Delete the feature
    await Feature.findByIdAndDelete(id);

    // Log the action
    await AuditLog.create({
      userId: req.user._id,
      userType: 'admin',
      action: 'feature_deleted',
      entityType: 'feature',
      entityId: id,
      changes: [
        {
          field: 'all',
          oldValue: feature
        }
      ],
      metadata: { featureKey: feature.key },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    });

    await session.commitTransaction();
    
    res.status(200).json(successResponse('Feature deleted successfully', null));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Toggle feature enabled status
export const toggleFeatureStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const feature = await Feature.findById(id);
    if (!feature) {
      return next(new AppError('Feature not found', 404));
    }

    // Toggle the status
    const isEnabled = !feature.isEnabled;
    
    const updatedFeature = await Feature.findByIdAndUpdate(
      id,
      { 
        isEnabled,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Log the action
    await AuditLog.create({
      userId: req.user._id,
      userType: 'admin',
      action: isEnabled ? 'feature_enabled' : 'feature_disabled',
      entityType: 'feature',
      entityId: id,
      changes: [
        {
          field: 'isEnabled',
          oldValue: feature.isEnabled,
          newValue: isEnabled
        }
      ],
      metadata: { featureKey: feature.key },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    });
    
    res.status(200).json(
      successResponse(
        `Feature ${isEnabled ? 'enabled' : 'disabled'} successfully`, 
        updatedFeature
      )
    );
  } catch (error) {
    next(error);
  }
};

// Update feature rollout percentage
export const updateRolloutPercentage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rolloutPercentage } = req.body;
    
    if (rolloutPercentage < 0 || rolloutPercentage > 100) {
      return next(new AppError('Rollout percentage must be between 0 and 100', 400));
    }
    
    const feature = await Feature.findById(id);
    if (!feature) {
      return next(new AppError('Feature not found', 404));
    }

    const oldPercentage = feature.rolloutPercentage;
    
    const updatedFeature = await Feature.findByIdAndUpdate(
      id,
      { 
        rolloutPercentage,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Log the action
    await AuditLog.create({
      userId: req.user._id,
      userType: 'admin',
      action: 'feature_rollout_updated',
      entityType: 'feature',
      entityId: id,
      changes: [
        {
          field: 'rolloutPercentage',
          oldValue: oldPercentage,
          newValue: rolloutPercentage
        }
      ],
      metadata: { featureKey: feature.key },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    });
    
    res.status(200).json(
      successResponse('Feature rollout percentage updated successfully', updatedFeature)
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createFeature,
  getFeatures,
  getFeature,
  updateFeature,
  deleteFeature,
  toggleFeatureStatus,
  updateRolloutPercentage
};
