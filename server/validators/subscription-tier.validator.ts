
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/error';

const createSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  key: Joi.string().required().trim().regex(/^[a-z0-9_]+$/).message('Key must contain only lowercase letters, numbers, and underscores'),
  description: Joi.string().required().trim().min(10).max(500),
  price: Joi.object({
    monthly: Joi.number().required().min(0),
    yearly: Joi.number().required().min(0),
    currency: Joi.string().default('USD')
  }).required(),
  limits: Joi.object({
    users: Joi.number().required().min(1),
    storage: Joi.number().required().min(1),
    productsLimit: Joi.number().required().min(1),
    locationsLimit: Joi.number().required().min(1),
    customersLimit: Joi.number().required().min(1),
    apiRequestsPerDay: Joi.number().required().min(1)
  }).required(),
  features: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(true),
  order: Joi.number().default(0)
});

const updateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  key: Joi.string().trim().regex(/^[a-z0-9_]+$/).message('Key must contain only lowercase letters, numbers, and underscores'),
  description: Joi.string().trim().min(10).max(500),
  price: Joi.object({
    monthly: Joi.number().min(0),
    yearly: Joi.number().min(0),
    currency: Joi.string()
  }),
  limits: Joi.object({
    users: Joi.number().min(1),
    storage: Joi.number().min(1),
    productsLimit: Joi.number().min(1),
    locationsLimit: Joi.number().min(1),
    customersLimit: Joi.number().min(1),
    apiRequestsPerDay: Joi.number().min(1)
  }),
  features: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  order: Joi.number()
}).min(1);

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

export default {
  validateCreate,
  validateUpdate
};
