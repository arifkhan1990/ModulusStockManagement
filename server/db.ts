import mongoose from 'mongoose';
import config from './config';
import { 
  User,
  DemoRequest, 
  Location, 
  Supplier, 
  Product, 
  Inventory, 
  StockMovement,
  Category,
  Customer,
  Order,
  Warehouse,
  PurchaseOrder,
  SalesChannel,
  Report,
  Alert,
  Payment
} from './models';

/**
 * Initialize the MongoDB connection with optimizations for high volume
 */
export async function initDatabase() {
  try {
    mongoose.set('debug', config.isDev);

    // Advanced options for performance and reliability
    await mongoose.connect(config.database.url, {
      maxPoolSize: config.database.poolSize || 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      readPreference: 'secondaryPreferred', // Read from secondaries when available
      readConcern: { level: 'majority' }, // Read consistent data
      writeConcern: { w: 'majority' }, // Write with majority acknowledgment
    });

    // Add connection monitoring
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Utility function to check database health
export const checkDatabaseHealth = async () => {
  if (mongoose.connection.readyState !== 1) {
    return { status: 'error', connection: 'disconnected' };
  }

  try {
    // Ping the database
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', connection: 'connected' };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'error', connection: 'unhealthy' };
  }
};

// Database middleware for tenant isolation
export const tenantIsolationMiddleware = async (req, res, next) => {
  if (req.user && req.user.companyId) {
    // Set company context for multi-tenancy 
    req.tenantId = req.user.companyId;
  }
  next();
};

// Export database models
export const db = {
  mongoose,
  models: {
    User,
    DemoRequest,
    Location,
    Supplier,
    Product,
    Inventory,
    StockMovement,
    Category,
    Customer,
    Order,
    Warehouse,
    PurchaseOrder,
    SalesChannel,
    Report,
    Alert,
    Payment
  }
};