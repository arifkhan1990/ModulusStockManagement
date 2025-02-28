
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/error';

// This would typically import your company preference model
// import CompanyPreference from '../models/company-preference.model';

/**
 * Get all features for a company
 */
export const getFeatures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, you would fetch from the database
    // const companyPreference = await CompanyPreference.findOne({ companyId: req.company._id });
    
    // For now, return sample data
    const features = [
      { id: 'notifications', enabled: true },
      { id: 'sharing', enabled: true },
      { id: 'billing', enabled: true },
      { id: 'reports', enabled: true },
      { id: 'import', enabled: true }
    ];
    
    res.status(200).json({
      status: 'success',
      data: features
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update company features
 */
export const updateFeatures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { features } = req.body;
    
    if (!features || !Array.isArray(features)) {
      return next(new AppError('Invalid features data', 400));
    }
    
    // In a real implementation, you would update in the database
    // await CompanyPreference.findOneAndUpdate(
    //   { companyId: req.company._id },
    //   { $set: { features } },
    //   { new: true, upsert: true }
    // );
    
    res.status(200).json({
      status: 'success',
      message: 'Features updated successfully',
      data: features
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get company preferences
 */
export const getPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, you would fetch from the database
    // const companyPreference = await CompanyPreference.findOne({ companyId: req.company._id });
    
    // For now, return sample data
    const preferences = {
      theme: 'light',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en'
    };
    
    res.status(200).json({
      status: 'success',
      data: preferences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update company preferences
 */
export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences || typeof preferences !== 'object') {
      return next(new AppError('Invalid preferences data', 400));
    }
    
    // In a real implementation, you would update in the database
    // await CompanyPreference.findOneAndUpdate(
    //   { companyId: req.company._id },
    //   { $set: { preferences } },
    //   { new: true, upsert: true }
    // );
    
    res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    next(error);
  }
};
