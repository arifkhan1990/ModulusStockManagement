
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/error';

/**
 * Middleware to validate request data against a Zod schema
 */
export const validateResource = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request against schema
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod error for better readability
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        
        return next(new AppError('Validation error', 400, formattedErrors));
      }
      
      next(error);
    }
  };
};

export default validateResource;
