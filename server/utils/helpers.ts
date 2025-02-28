
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
