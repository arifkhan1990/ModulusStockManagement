import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import mongoose from 'mongoose';

const validateCreate = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, limits, features } = req.body;

  // Check required fields
  if (!name || !description || !price || !limits) {
    return next(new AppError('Missing required fields', 400));
  }

  // Validate price structure
  if (!price.monthly || !price.yearly || !price.currency) {
    return next(new AppError('Price must include monthly, yearly rates and currency', 400));
  }

  // Validate limits structure
  if (typeof limits.users === 'undefined' || 
      typeof limits.storage === 'undefined' || 
      typeof limits.productsLimit === 'undefined' || 
      typeof limits.locationsLimit === 'undefined' || 
      typeof limits.customersLimit === 'undefined' || 
      typeof limits.apiRequestsPerDay === 'undefined') {
    return next(new AppError('Limits must include users, storage, and all required limit values', 400));
  }

  // Validate numeric values
  if (isNaN(price.monthly) || isNaN(price.yearly) || 
      isNaN(limits.users) || isNaN(limits.storage) || 
      isNaN(limits.productsLimit) || isNaN(limits.locationsLimit) || 
      isNaN(limits.customersLimit) || isNaN(limits.apiRequestsPerDay)) {
    return next(new AppError('Numeric values are required for price and limits', 400));
  }

  // Validate features array if provided
  if (features && !Array.isArray(features)) {
    return next(new AppError('Features must be an array', 400));
  }

  next();
};

const validateUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid subscription tier ID', 400));
  }

  // If price is provided, validate structure
  if (req.body.price) {
    const { price } = req.body;
    if ((price.monthly && isNaN(price.monthly)) || 
        (price.yearly && isNaN(price.yearly))) {
      return next(new AppError('Numeric values are required for price', 400));
    }
  }

  // If limits are provided, validate structure
  if (req.body.limits) {
    const { limits } = req.body;
    const numericFields = ['users', 'storage', 'productsLimit', 'locationsLimit', 'customersLimit', 'apiRequestsPerDay'];

    for (const field of numericFields) {
      if (limits[field] !== undefined && isNaN(limits[field])) {
        return next(new AppError(`Numeric value required for ${field}`, 400));
      }
    }
  }

  // Validate features array if provided
  if (req.body.features && !Array.isArray(req.body.features)) {
    return next(new AppError('Features must be an array', 400));
  }

  next();
};

export default {
  validateCreate,
  validateUpdate
};