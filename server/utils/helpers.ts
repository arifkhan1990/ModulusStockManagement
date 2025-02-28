
import crypto from 'crypto';

/**
 * Generate a secure random API key
 */
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Check if a value is within the limit
 */
export function isWithinLimit(current: number, limit: number): boolean {
  return current < limit;
}

/**
 * Parse pagination parameters
 */
export function getPaginationParams(req): { page: number; limit: number } {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  return { page, limit };
}

/**
 * Create an index name for sharded collections
 */
export function createShardKey(companyId: string): string {
  return `c_${companyId}`;
}
import mongoose from 'mongoose';

/**
 * Standard success response format
 */
export const successResponse = (message: string, data: any) => {
  return {
    status: 'success',
    message,
    data
  };
};

/**
 * Sanitize data for response (remove sensitive fields)
 */
export const sanitizeData = (data: any, sensitiveFields: string[] = ['password', '__v']) => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, sensitiveFields));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        delete sanitized[field];
      }
    });
    
    return sanitized;
  }
  
  return data;
};

/**
 * Generate a random string (useful for tokens, etc.)
 */
export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Check if a MongoDB ID is valid
 */
export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generate a pagination object for responses
 */
export const getPaginationData = (total: number, page: number, limit: number) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasPrev: page > 1,
    hasNext: page < Math.ceil(total / limit)
  };
};

export default {
  successResponse,
  sanitizeData,
  generateRandomString,
  isValidObjectId,
  formatDate,
  getPaginationData
};
