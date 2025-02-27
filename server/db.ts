
import mongoose from 'mongoose';
import * as schema from "@shared/schema";
import config from "./config";

export async function initDatabase() {
  try {
    if (!config.database.url) {
      throw new Error("DATABASE_URL env var is not set");
    }
    
    await mongoose.connect(config.database.url);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export const db = {
  mongoose,
  models: {
    User: schema.User,
    DemoRequest: schema.DemoRequest,
    Location: schema.Location,
    Supplier: schema.Supplier,
    Product: schema.Product,
    Inventory: schema.Inventory,
    StockMovement: schema.StockMovement
  }
};
