import { Request, Response, NextFunction } from 'express';
import SubscriptionTier from '../models/subscription-tier.model';
import AppError from '../utils/appError';

/**
 * Create a new subscription tier
 */
export const createSubscriptionTier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      key,
      description,
      price,
      limits,
      features,
      isActive,
      order
    } = req.body;

    const newTier = await SubscriptionTier.create({
      name,
      key: key || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      price,
      limits,
      features,
      isActive: isActive ?? true,
      order: order ?? 0
    });

    return res.status(201).json(newTier);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new AppError('A tier with this key already exists', 400));
    }
    return next(new AppError(error.message, 500));
  }
};

/**
 * Get all subscription tiers
 */
export const getSubscriptionTiers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tiers = await SubscriptionTier.find().sort({ order: 1 });
    return res.status(200).json(tiers);
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * Get a single subscription tier
 */
export const getSubscriptionTier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tier = await SubscriptionTier.findById(req.params.id);
    if (!tier) {
      return next(new AppError('Subscription tier not found', 404));
    }
    return res.status(200).json(tier);
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * Update a subscription tier
 */
export const updateSubscriptionTier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedTier = await SubscriptionTier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedTier) {
      return next(new AppError('Subscription tier not found', 404));
    }

    return res.status(200).json(updatedTier);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new AppError('A tier with this key already exists', 400));
    }
    return next(new AppError(error.message, 500));
  }
};

/**
 * Delete a subscription tier
 */
export const deleteSubscriptionTier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedTier = await SubscriptionTier.findByIdAndDelete(req.params.id);

    if (!deletedTier) {
      return next(new AppError('Subscription tier not found', 404));
    }

    return res.status(204).send();
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

/**
 * Toggle a subscription tier's active status
 */
export const toggleTierStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tier = await SubscriptionTier.findById(req.params.id);

    if (!tier) {
      return next(new AppError('Subscription tier not found', 404));
    }

    tier.isActive = !tier.isActive;
    tier.updatedAt = new Date();
    await tier.save();

    return res.status(200).json(tier);
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};