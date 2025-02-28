// Configuration for the application
import 'dotenv/config';

const config = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-management',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
    secureCookies: process.env.NODE_ENV === 'production',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    resetSecret: process.env.JWT_RESET_SECRET || 'default-reset-secret-change-in-production',
  },

  auth: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
  },

  storage: {
    type: process.env.STORAGE_TYPE || 'local', // local, s3, etc.
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET,
    },
    local: {
      uploadDir: process.env.LOCAL_UPLOAD_DIR || 'uploads',
    },
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    from: process.env.MAIL_FROM || 'noreply@stockmanagement.com',
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  cache: {
    ttl: 60 * 5, // 5 minutes in seconds
  },
  // Add billing service configuration (Implementation needed)
  billing: {
    // ... billing service settings ...
  },

};

export default config;