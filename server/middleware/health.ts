
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
