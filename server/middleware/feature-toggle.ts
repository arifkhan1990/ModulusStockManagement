import { Request, Response, NextFunction } from 'express';
import FeatureToggle from '../models/feature-toggle.model';
import { AppError } from '../utils/error';
import mongoose from 'mongoose';

/**
 * Middleware to check if a specific feature is enabled for a company
 */
export const checkFeatureEnabled = (featureName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.company?._id) {
        return next(new AppError('Company context not available', 400));
      }

      const featureToggle = await FeatureToggle.findOne({
        companyId: req.company._id,
        feature: featureName
      });

      // If feature toggle doesn't exist or is disabled
      if (!featureToggle || !featureToggle.enabled) {
        return next(new AppError(`Feature '${featureName}' is not enabled for your company`, 403));
      }

      // Add feature configuration to the request if it exists
      if (featureToggle.configuration) {
        req.featureConfig = featureToggle.configuration;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper function to create default feature toggles for a new company
 */
export const createDefaultFeatureToggles = async (companyId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
  // List of default features
  const defaultFeatures = [
    { feature: 'inventory_management', enabled: true },
    { feature: 'order_management', enabled: true },
    { feature: 'invoice_management', enabled: true },
    { feature: 'pos', enabled: true },
    { feature: 'analytics', enabled: false },
    { feature: 'multi_location', enabled: false },
    { feature: 'user_management', enabled: true },
    { feature: 'customer_management', enabled: true },
    { feature: 'invoice_customization', enabled: true },
    { feature: 'online_payments', enabled: false }
  ];

  // Create feature toggles in bulk
  const featureToggles = defaultFeatures.map(feature => ({
    companyId,
    ...feature,
    createdBy: userId,
    updatedBy: userId
  }));

  await FeatureToggle.insertMany(featureToggles);
};

export default {
  checkFeatureEnabled,
  createDefaultFeatureToggles
};