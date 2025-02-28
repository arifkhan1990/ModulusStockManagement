
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import mongoose from 'mongoose';

// Validate subscription process request
const validateSubscriptionProcess = (req: Request, res: Response, next: NextFunction) => {
  const { companyId, tierId, paymentMethod, billingCycle } = req.body;

  // Check required fields
  if (!companyId || !tierId || !paymentMethod || !billingCycle) {
    return next(new AppError('Missing required fields', 400));
  }

  // Validate MongoDB IDs
  if (!mongoose.Types.ObjectId.isValid(companyId) || !mongoose.Types.ObjectId.isValid(tierId)) {
    return next(new AppError('Invalid company or tier ID', 400));
  }

  // Validate payment method
  const validPaymentMethods = ['stripe', 'paypal', 'bank_transfer'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return next(new AppError('Invalid payment method', 400));
  }

  // Validate billing cycle
  const validBillingCycles = ['monthly', 'yearly'];
  if (!validBillingCycles.includes(billingCycle)) {
    return next(new AppError('Invalid billing cycle', 400));
  }

  next();
};

// Validate subscription update request
const validateSubscriptionUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const { tierId, billingCycle } = req.body;

  // Check required fields
  if (!tierId || !billingCycle) {
    return next(new AppError('Missing required fields', 400));
  }

  // Validate MongoDB IDs
  if (!mongoose.Types.ObjectId.isValid(companyId) || !mongoose.Types.ObjectId.isValid(tierId)) {
    return next(new AppError('Invalid company or tier ID', 400));
  }

  // Validate billing cycle
  const validBillingCycles = ['monthly', 'yearly'];
  if (!validBillingCycles.includes(billingCycle)) {
    return next(new AppError('Invalid billing cycle', 400));
  }

  next();
};

// Validate subscription cancel request
const validateSubscriptionCancel = (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const { reason } = req.body;

  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return next(new AppError('Invalid company ID', 400));
  }

  // Check if reason is provided
  if (!reason) {
    return next(new AppError('Cancellation reason is required', 400));
  }

  next();
};

export default {
  validateSubscriptionProcess,
  validateSubscriptionUpdate,
  validateSubscriptionCancel,
};
