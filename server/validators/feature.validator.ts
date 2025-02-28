
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/error';

const createSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  key: Joi.string().required().trim().regex(/^[a-z0-9_]+$/).message('Key must contain only lowercase letters, numbers, and underscores'),
  description: Joi.string().required().trim().min(10).max(500),
  category: Joi.string().required().trim(),
  isEnabled: Joi.boolean().default(true),
  isGlobal: Joi.boolean().default(false),
  isMandatory: Joi.boolean().default(false),
  defaultSettings: Joi.object().default({}),
  dependencies: Joi.array().items(Joi.string()).default([]),
  subscriptionTiers: Joi.array().items(Joi.string()).default([]),
  rolloutPercentage: Joi.number().min(0).max(100).default(100),
  version: Joi.string().default('1.0.0'),
  order: Joi.number().default(0),
  icon: Joi.string().allow('').optional(),
  tags: Joi.array().items(Joi.string()).default([])
});

const updateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  key: Joi.string().trim().regex(/^[a-z0-9_]+$/).message('Key must contain only lowercase letters, numbers, and underscores'),
  description: Joi.string().trim().min(10).max(500),
  category: Joi.string().trim(),
  isEnabled: Joi.boolean(),
  isGlobal: Joi.boolean(),
  isMandatory: Joi.boolean(),
  defaultSettings: Joi.object(),
  dependencies: Joi.array().items(Joi.string()),
  subscriptionTiers: Joi.array().items(Joi.string()),
  rolloutPercentage: Joi.number().min(0).max(100),
  version: Joi.string(),
  order: Joi.number(),
  icon: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string())
}).min(1);

const rolloutUpdateSchema = Joi.object({
  rolloutPercentage: Joi.number().min(0).max(100).required()
});

export const validateCreate = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export const validateRolloutUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = rolloutUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }
  
  req.body = value;
  next();
};

export default {
  validateCreate,
  validateUpdate,
  validateRolloutUpdate
};
