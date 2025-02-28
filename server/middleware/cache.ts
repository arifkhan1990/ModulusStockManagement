
import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';

export const cacheMiddleware = (ttl: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET methods and authenticated routes
    if (req.method !== 'GET' || req.path.includes('/api/auth/')) {
      return next();
    }
    
    const companyId = req.headers['x-company-id'] as string;
    const key = `cache:${companyId}:${req.originalUrl}`;
    
    try {
      const cachedData = await cacheService.get(key);
      
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
      
      // Store the original res.json function
      const originalJson = res.json;
      
      // Override res.json
      res.json = function(body) {
        // Restore the original res.json function
        res.json = originalJson;
        
        // Cache the response data
        if (res.statusCode === 200) {
          cacheService.set(key, body, ttl);
        }
        
        // Call the original json function with the body
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Utility to clear cache for specific patterns
export const clearCache = async (pattern: string): Promise<void> => {
  try {
    await cacheService.invalidate(pattern);
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};
