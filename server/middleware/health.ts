
import { Request, Response } from 'express';
import { checkDatabaseHealth } from '../db';
import os from 'os';

// Basic health check
export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
};

// Detailed health check
export const detailedHealthCheck = async (req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();
  
  // System resource usage
  const systemInfo = {
    uptime: process.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      process: process.memoryUsage(),
    },
    cpu: {
      loadAvg: os.loadavg(),
      cpus: os.cpus().length,
    },
  };
  
  res.status(dbHealth.status === 'healthy' ? 200 : 500).json({
    status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbHealth,
    system: systemInfo,
  });
};

// Ready check for load balancers
export const readyCheck = async (req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();
  
  if (dbHealth.status === 'healthy') {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
};
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import os from 'os';

/**
 * Simple health check endpoint for load balancers
 */
export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({ status: 'ok' });
};

/**
 * More detailed health check with system information
 */
export const detailedHealthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    },
    system: {
      loadAvg: os.loadavg(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: (1 - os.freemem() / os.totalmem()) * 100
      },
      cpus: os.cpus().length
    },
    process: {
      memory: process.memoryUsage(),
      version: process.version
    }
  };
  
  const statusCode = health.database.status === 'connected' ? 200 : 503;
  return res.status(statusCode).json(health);
};

/**
 * Readiness check that verifies if the service is ready to accept traffic
 */
export const readyCheck = (req: Request, res: Response) => {
  // Check database connection
  const dbReady = mongoose.connection.readyState === 1;
  
  if (!dbReady) {
    return res.status(503).json({
      status: 'not_ready',
      reason: 'Database connection not established'
    });
  }
  
  return res.status(200).json({ status: 'ready' });
};
