import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

const validateFeatureToggle = (req: Request, res: Response, next: NextFunction) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    return next(new AppError('Enabled status must be a boolean', 400));
  }
  next();
};

const validateFeaturePriority = (req: Request, res: Response, next: NextFunction) => {
  const { priority } = req.body;
  if (!Number.isInteger(priority) || priority < 0) {
    return next(new AppError('Priority must be a positive integer', 400));
  }
  next();
};

const validateFeatureSettings = (req: Request, res: Response, next: NextFunction) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return next(new AppError('Settings must be an object', 400));
  }
  next();
};

const validateBranding = (req: Request, res: Response, next: NextFunction) => {
  const { logo, colors, fonts } = req.body;
  if (!logo && !colors && !fonts) {
    return next(new AppError('At least one branding element must be provided', 400));
  }
  next();
};

const validateNotifications = (req: Request, res: Response, next: NextFunction) => {
  const { email, push, sms } = req.body;
  if (typeof email !== 'boolean' && typeof push !== 'boolean' && typeof sms !== 'boolean') {
    return next(new AppError('At least one notification channel must be specified', 400));
  }
  next();
};

const validateSharing = (req: Request, res: Response, next: NextFunction) => {
  const { platforms } = req.body;
  if (!platforms || !Array.isArray(platforms)) {
    return next(new AppError('Platforms must be an array', 400));
  }
  next();
};

const validateGeneralSettings = (req: Request, res: Response, next: NextFunction) => {
  const { theme, dateFormat, currency, timezone, language } = req.body;
  if (!theme && !dateFormat && !currency && !timezone && !language) {
    return next(new AppError('At least one setting must be provided', 400));
  }
  next();
};

export default {
  validateFeatureToggle,
  validateFeaturePriority,
  validateFeatureSettings,
  validateBranding,
  validateNotifications,
  validateSharing,
  validateGeneralSettings
};