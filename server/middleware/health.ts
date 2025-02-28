import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Simple health check endpoint for load balancers
 */
export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
};

/**
 * Detailed health check that includes database connectivity
 * and other system component statuses
 */
export const detailedHealthCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date(),
      services: {
        server: { status: 'ok' },
        database: { status: 'unknown' }
      },
      environment: process.env.NODE_ENV || 'development'
    };

    // Check database connection
    if (mongoose.connection.readyState === 1) {
      healthStatus.services.database.status = 'ok';
    } else {
      healthStatus.services.database.status = 'error';
      healthStatus.status = 'degraded';
    }

    // Add more service checks here as needed
    // For example, Redis, external APIs, etc.

    const statusCode = healthStatus.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    next(error);
  }
};

/**
 * Readiness check that verifies if the application is ready to serve requests
 * This is different from health check as it ensures all required services
 * are connected and ready
 */
export const readyCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        status: 'not_ready', 
        message: 'Database connection not established'
      });
    }

    // Add additional readiness checks here
    // For example, checking if required cache is warmed up

    res.status(200).json({ status: 'ready' });
  } catch (error) {
    next(error);
  }
};