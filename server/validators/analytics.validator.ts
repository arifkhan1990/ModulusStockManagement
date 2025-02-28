import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/error';
import { z } from 'zod';

const featureTrackingSchema = Joi.object({
  featureKey: Joi.string().required(),
  timeSpent: Joi.number().min(0).default(0)
});

const pageTrackingSchema = Joi.object({
  path: Joi.string().required()
});

const errorTrackingSchema = Joi.object({
  error: Joi.object().optional(),
  responseTime: Joi.number().min(0).default(0)
});

export const validateFeatureTracking = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = featureTrackingSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.body = value;
  next();
};

export const validatePageTracking = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = pageTrackingSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.body = value;
  next();
};

export const validateErrorTracking = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = errorTrackingSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  req.body = value;
  next();
};

export const analyticsValidators = {
  getAnalytics: z.object({
    query: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      type: z.enum(['inventory', 'sales', 'revenue', 'popular_products']).optional(),
      groupBy: z.enum(['day', 'week', 'month', 'year']).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional()
    })
  }),

  exportAnalytics: z.object({
    query: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      type: z.enum(['inventory', 'sales', 'revenue', 'popular_products']).optional(),
      format: z.enum(['csv', 'pdf', 'excel']).optional()
    })
  })
};

export default {
  validateFeatureTracking,
  validatePageTracking,
  validateErrorTracking,
  analyticsValidators
};