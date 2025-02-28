
import { Request, Response, NextFunction } from 'express';
import FeatureToggle from '../models/feature-toggle.model';
import { AppError } from '../utils/error';

// Middleware to check if a feature is enabled
export const checkFeatureEnabled = (featureName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.company?._id;
      
      if (!companyId) {
        return next(new AppError('Company not found', 400));
      }
      
      // Find the feature toggle
      const feature = await FeatureToggle.findOne({ 
        companyId, 
        name: featureName 
      });
      
      // If feature doesn't exist or is disabled, return error
      if (!feature || !feature.enabled) {
        return next(new AppError('This feature is not available', 403));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Helper to create default features for a new company
export const createDefaultFeatureToggles = async (companyId: string, userId: string) => {
  try {
    // Define default features
    const defaultFeatures = [
      {
        name: 'invoices',
        description: 'Enable invoice creation and management',
        enabled: true
      },
      {
        name: 'custom_invoices',
        description: 'Allow customization of invoice templates',
        enabled: true
      },
      {
        name: 'online_payments',
        description: 'Enable online payment processing',
        enabled: true
      },
      {
        name: 'sms_notifications',
        description: 'Send SMS notifications to customers',
        enabled: false
      },
      {
        name: 'email_notifications',
        description: 'Send email notifications to customers',
        enabled: true
      },
      {
        name: 'analytics',
        description: 'Advanced analytics and reporting',
        enabled: true
      }
    ];
    
    // Create each feature
    const features = defaultFeatures.map(feature => ({
      companyId,
      name: feature.name,
      description: feature.description,
      enabled: feature.enabled,
      updatedBy: userId,
      updatedAt: new Date()
    }));
    
    await FeatureToggle.insertMany(features);
    
    return true;
  } catch (error) {
    console.error('Error creating default feature toggles:', error);
    return false;
  }
};

export default {
  checkFeatureEnabled,
  createDefaultFeatureToggles
};
