
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Global rate limiter
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15-minute window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  },
  skip: (req: Request) => {
    // Skip rate limiting for certain paths if needed
    return req.path.startsWith('/api/public');
  }
});

// API-specific rate limiter (more strict)
export const apiRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // Limit each IP to 300 requests per 5-minute window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many API requests, please try again later.'
  }
});

// Authentication rate limiter (very strict)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login attempts per 15-minute window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login attempts, please try again later.'
  }
});
import rateLimit from 'express-rate-limit';

// Global rate limit for all requests (100 requests per 15 minutes)
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});

// Stricter rate limit for API endpoints (50 requests per 15 minutes)
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many API requests, please try again later.'
  }
});

// Rate limit for auth endpoints (5 requests per minute)
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  }
});

export default {
  globalRateLimit,
  apiRateLimit,
  authRateLimit
};
