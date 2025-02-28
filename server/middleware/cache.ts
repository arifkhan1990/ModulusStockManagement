
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Redis from 'redis';
import { successResponse } from '../utils/helpers';
import config from '../config';

// Create Redis client if configured
let redisClient: any = null;

if (config.redis && config.redis.url) {
  redisClient = Redis.createClient({
    url: config.redis.url,
    password: config.redis.password
  });

  redisClient.on('error', (err: Error) => {
    console.error('Redis client error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  // Connect to Redis
  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error('Redis connection error:', err);
    }
  })();
}

// Cache key generator
const generateCacheKey = (req: Request): string => {
  const companyId = req.company?._id || 'global';
  const userId = req.user?._id || 'anonymous';
  const path = req.originalUrl || req.url;
  const query = JSON.stringify(req.query || {});

  return `cache:${companyId}:${userId}:${path}:${query}`;
};

/**
 * Cache middleware for Express
 * @param ttl Time to live in seconds
 * @returns Express middleware
 */
export const cacheMiddleware = (ttl: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET' || !redisClient || !redisClient.isReady) {
      return next();
    }

    // Skip caching if cache is disabled in the request
    if (req.query.noCache === 'true') {
      return next();
    }

    try {
      const key = generateCacheKey(req);
      
      // Check if the request is cached
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        const parsedResponse = JSON.parse(cachedResponse);
        return res.status(200).json({
          ...parsedResponse,
          _cachedAt: new Date().toISOString()
        });
      }

      // If not cached, intercept the response to cache it
      const originalSend = res.json;
      res.json = function(body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Don't cache responses with errors
          if (!body.error) {
            // Set cache with TTL
            redisClient.setEx(key, ttl, JSON.stringify(body))
              .catch((err: Error) => console.error('Redis cache set error:', err));
          }
        }
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Clear cache for a specific pattern
 * @param pattern Cache key pattern (e.g., "cache:companyId:*")
 * @returns Promise<number> Number of keys removed
 */
export const clearCache = async (pattern: string): Promise<number> => {
  if (!redisClient || !redisClient.isReady) {
    return 0;
  }

  try {
    // Find keys matching the pattern
    const keys = await redisClient.keys(pattern);
    
    if (keys.length === 0) {
      return 0;
    }

    // Delete all matching keys
    await redisClient.del(keys);
    return keys.length;
  } catch (error) {
    console.error('Clear cache error:', error);
    return 0;
  }
};

/**
 * Clear company cache
 * @param companyId Company ID
 * @returns Promise<number> Number of keys removed
 */
export const clearCompanyCache = async (companyId: string): Promise<number> => {
  return clearCache(`cache:${companyId}:*`);
};

/**
 * Clear user cache
 * @param companyId Company ID
 * @param userId User ID
 * @returns Promise<number> Number of keys removed
 */
export const clearUserCache = async (companyId: string, userId: string): Promise<number> => {
  return clearCache(`cache:${companyId}:${userId}:*`);
};

/**
 * Clear all cache
 * @returns Promise<number> Number of keys removed
 */
export const clearAllCache = async (): Promise<number> => {
  return clearCache('cache:*');
};

/**
 * Cache middleware for API responses
 */
export default {
  cacheMiddleware,
  clearCache,
  clearCompanyCache, 
  clearUserCache,
  clearAllCache
};
