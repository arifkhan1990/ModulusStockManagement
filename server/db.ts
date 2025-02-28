
import mongoose from 'mongoose';
import config from './config';
import { 
  User,
  DemoRequest, 
  Location, 
  Supplier, 
  Product, 
  Inventory, 
  StockMovement 
} from './models';

/**
 * Initialize the MongoDB connection
 */
export async function initDatabase() {
  try {
    if (!config.database.url) {
      throw new Error("DATABASE_URL env var is not set");
    }
    
    // Configure mongoose
    mongoose.set('strictQuery', true);
    
    // Connect to MongoDB
    await mongoose.connect(config.database.url);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

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
    StockMovement
  }
};
