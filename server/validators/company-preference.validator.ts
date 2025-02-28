
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/error';

const featureToggleSchema = Joi.object({
  isEnabled: Joi.boolean().required()
});

const featurePrioritySchema = Joi.object({
  priority: Joi.number().required().min(1)
});

const featureSettingsSchema = Joi.object({
  settings: Joi.object().required()
});

const brandingSchema = Joi.object({
  branding: Joi.object({
    primaryColor: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).message('Invalid color format').optional(),
    secondaryColor: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).message('Invalid color format').optional(),
    accentColor: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).message('Invalid color format').optional(),
    logo: Joi.string().uri().allow('').optional(),
    favicon: Joi.string().uri().allow('').optional()
  }).required().min(1)
});

const notificationsSchema = Joi.object({
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    messenger: Joi.boolean().optional(),
    discord: Joi.boolean().optional(),
    whatsapp: Joi.boolean().optional(),
    telegram: Joi.boolean().optional()
  }).required().min(1)
});

const sharingSchema = Joi.object({
  sharing: Joi.object({
    facebook: Joi.boolean().optional(),
    twitter: Joi.boolean().optional(),
    linkedin: Joi.boolean().optional(),
    instagram: Joi.boolean().optional(),
    tiktok: Joi.boolean().optional()
  }).required().min(1)
});

const generalSettingsSchema = Joi.object({
  defaultLanguage: Joi.string().min(2).max(5).optional(),
  defaultCurrency: Joi.string().min(3).max(3).optional(),
  timezone: Joi.string().optional(),
  dateFormat: Joi.string().optional()
}).min(1);

export const validateFeatureToggle = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = featureToggleSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateFeaturePriority = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = featurePrioritySchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateFeatureSettings = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = featureSettingsSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateBranding = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = brandingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateNotifications = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = notificationsSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateSharing = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = sharingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateGeneralSettings = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = generalSettingsSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
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
