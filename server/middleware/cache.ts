
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
import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache
const cache: Record<string, { data: any; expiry: number }> = {};

/**
 * Middleware to cache responses for GET requests
 * @param duration Cache duration in seconds
 */
export const cacheMiddleware = (duration: number = 60) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated requests
    if (req.user) {
      // For authenticated requests, we can still cache but need to include user ID in the key
      const userSpecificKey = `${req.originalUrl}-${req.user._id}`;
      
      // Check if we have a cached response for this user
      if (cache[userSpecificKey] && cache[userSpecificKey].expiry > Date.now()) {
        return res.json(cache[userSpecificKey].data);
      }
      
      // Store the original json method
      const originalJson = res.json;
      
      // Override the json method
      res.json = function (data) {
        // Save the result in cache
        cache[userSpecificKey] = {
          data,
          expiry: Date.now() + duration * 1000
        };
        
        // Call the original method
        return originalJson.call(this, data);
      };
      
      return next();
    }

    // For public routes
    const cacheKey = req.originalUrl;
    
    // Check if we have a cached response
    if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
      return res.json(cache[cacheKey].data);
    }
    
    // Store the original json method
    const originalJson = res.json;
    
    // Override the json method
    res.json = function (data) {
      // Save the result in cache
      cache[cacheKey] = {
        data,
        expiry: Date.now() + duration * 1000
      };
      
      // Call the original method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Helper function to clear cache
 * @param pattern Optional pattern to match cache keys
 */
export const clearCache = (pattern?: string) => {
  if (pattern) {
    const regex = new RegExp(pattern);
    Object.keys(cache).forEach(key => {
      if (regex.test(key)) {
        delete cache[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }
};

export default {
  cacheMiddleware,
  clearCache
};
