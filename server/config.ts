
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Environment type
type Environment = 'development' | 'production' | 'test';

// Determine current environment
const getNodeEnv = (): Environment => {
  const env = process.env.NODE_ENV as Environment;
  return env === 'production' ? 'production' : 'development';
};

// Config interface
interface Config {
  environment: Environment;
  isDev: boolean;
  isProd: boolean;
  server: {
    port: number;
    host: string;
  };
  session: {
    secret: string;
    secureCookies: boolean;
  };
  database: {
    url: string;
    poolSize?: number;
  };
  auth: {
    googleClientId: string | undefined;
    googleClientSecret: string | undefined;
  };
  redis?: {
    url: string;
    ttl: number;
  };
  stripe?: {
    secretKey: string;
    webhookSecret: string;
  };
}

// Create and export the config
const config: Config = {
  environment: getNodeEnv(),
  isDev: getNodeEnv() === 'development',
  isProd: getNodeEnv() === 'production',
  server: {
    port: parseInt(process.env.PORT || '5000'),
    host: '0.0.0.0',
  },
  session: {
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    secureCookies: getNodeEnv() === 'production',
  },
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/modulus-stock',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
  },
  auth: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.REDIS_TTL || '3600'),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
};

export default config;
