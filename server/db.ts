
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
    if (!config.database.url) {
      throw new Error("DATABASE_URL env var is not set");
    }
    
    // Configure mongoose for high traffic with pooling
    mongoose.set('strictQuery', true);
    
    // Connection options optimized for scaling
    const options = {
      maxPoolSize: 100, // Increase connection pool for high concurrency
      minPoolSize: 10,  // Minimum connections to maintain
      socketTimeoutMS: 45000, // Prevent long-running operations from timing out
      serverSelectionTimeoutMS: 5000, // Quick server selection for faster recovery
      heartbeatFrequencyMS: 10000, // Frequent heartbeats to detect issues
      retryWrites: true, // Retry write operations if they fail
      writeConcern: { w: 'majority' }, // Ensure writes are acknowledged by majority
      readPreference: 'secondaryPreferred', // Prefer reading from secondaries to distribute load
    };
    
    // Connect to MongoDB
    await mongoose.connect(config.database.url, options);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

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
