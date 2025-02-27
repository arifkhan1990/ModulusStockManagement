
import { db } from "./db";
import * as schema from "@shared/schema";
import mongoose from "mongoose";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

class Storage {
  // User methods
  async createUser(userData: Partial<schema.InsertUser> & { password?: string }) {
    try {
      const user = new db.models.User(userData);
      await user.save();
      return user.toObject();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUser(id: string) {
    try {
      const user = await db.models.User.findById(id);
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    try {
      const user = await db.models.User.findOne({ username });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async getUserByProviderId(provider: string, providerId: string) {
    try {
      const user = await db.models.User.findOne({ provider, providerId });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error getting user by provider ID:", error);
      throw error;
    }
  }

  // Demo Request methods
  async createDemoRequest(data: schema.InsertDemoRequest) {
    try {
      const demoRequest = new db.models.DemoRequest(data);
      await demoRequest.save();
      return demoRequest.toObject();
    } catch (error) {
      console.error("Error creating demo request:", error);
      throw error;
    }
  }

  // Location methods
  async createLocation(data: schema.InsertLocation) {
    try {
      const location = new db.models.Location(data);
      await location.save();
      return location.toObject();
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  }

  async getLocations() {
    try {
      const locations = await db.models.Location.find({ isActive: true });
      return locations.map(location => location.toObject());
    } catch (error) {
      console.error("Error getting locations:", error);
      throw error;
    }
  }

  async getLocation(id: string) {
    try {
      const location = await db.models.Location.findById(id);
      return location ? location.toObject() : null;
    } catch (error) {
      console.error("Error getting location:", error);
      throw error;
    }
  }

  async updateLocation(id: string, data: Partial<schema.InsertLocation>) {
    try {
      const location = await db.models.Location.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      );
      return location ? location.toObject() : null;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  async deleteLocation(id: string) {
    try {
      const location = await db.models.Location.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );
      return location ? location.toObject() : null;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }

  // Supplier methods
  async createSupplier(data: schema.InsertSupplier) {
    try {
      const supplier = new db.models.Supplier(data);
      await supplier.save();
      return supplier.toObject();
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  }

  async getSuppliers() {
    try {
      const suppliers = await db.models.Supplier.find({ isActive: true });
      return suppliers.map(supplier => supplier.toObject());
    } catch (error) {
      console.error("Error getting suppliers:", error);
      throw error;
    }
  }

  async getSupplier(id: string) {
    try {
      const supplier = await db.models.Supplier.findById(id);
      return supplier ? supplier.toObject() : null;
    } catch (error) {
      console.error("Error getting supplier:", error);
      throw error;
    }
  }

  async updateSupplier(id: string, data: Partial<schema.InsertSupplier>) {
    try {
      const supplier = await db.models.Supplier.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      );
      return supplier ? supplier.toObject() : null;
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  }

  async deleteSupplier(id: string) {
    try {
      const supplier = await db.models.Supplier.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );
      return supplier ? supplier.toObject() : null;
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  }

  // Product methods
  async createProduct(data: schema.InsertProduct) {
    try {
      const product = new db.models.Product(data);
      await product.save();
      return product.toObject();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await db.models.Product.find().populate('supplierId');
      return products.map(product => product.toObject());
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  }

  async getProduct(id: string) {
    try {
      const product = await db.models.Product.findById(id).populate('supplierId');
      return product ? product.toObject() : null;
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  }

  async updateProduct(id: string, data: Partial<schema.InsertProduct>) {
    try {
      const product = await db.models.Product.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      ).populate('supplierId');
      return product ? product.toObject() : null;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await db.models.Product.findByIdAndDelete(id);
      return product ? product.toObject() : null;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Inventory methods
  async createInventory(data: schema.InsertInventory) {
    try {
      const inventory = new db.models.Inventory(data);
      await inventory.save();
      return inventory.toObject();
    } catch (error) {
      console.error("Error creating inventory:", error);
      throw error;
    }
  }

  async getInventory(productId: string, locationId: string) {
    try {
      const inventory = await db.models.Inventory.findOne({
        productId: new mongoose.Types.ObjectId(productId),
        locationId: new mongoose.Types.ObjectId(locationId)
      }).populate('productId locationId');
      return inventory ? inventory.toObject() : null;
    } catch (error) {
      console.error("Error getting inventory:", error);
      throw error;
    }
  }

  async getInventoryByLocation(locationId: string) {
    try {
      const inventory = await db.models.Inventory.find({
        locationId: new mongoose.Types.ObjectId(locationId)
      }).populate('productId locationId');
      return inventory.map(item => item.toObject());
    } catch (error) {
      console.error("Error getting inventory by location:", error);
      throw error;
    }
  }

  async updateInventory(id: string, data: Partial<schema.InsertInventory>) {
    try {
      const inventory = await db.models.Inventory.findByIdAndUpdate(
        id,
        { ...data, lastUpdated: new Date() },
        { new: true }
      );
      return inventory ? inventory.toObject() : null;
    } catch (error) {
      console.error("Error updating inventory:", error);
      throw error;
    }
  }

  // Stock Movement methods
  async createStockMovement(data: schema.InsertStockMovement) {
    try {
      const stockMovement = new db.models.StockMovement(data);
      await stockMovement.save();
      return stockMovement.toObject();
    } catch (error) {
      console.error("Error creating stock movement:", error);
      throw error;
    }
  }

  async getStockMovements(productId: string) {
    try {
      const stockMovements = await db.models.StockMovement.find({
        productId: new mongoose.Types.ObjectId(productId)
      }).populate('productId fromLocationId toLocationId createdBy');
      return stockMovements.map(movement => movement.toObject());
    } catch (error) {
      console.error("Error getting stock movements:", error);
      throw error;
    }
  }

  async getAllStockMovements() {
    try {
      const stockMovements = await db.models.StockMovement.find()
        .populate('productId fromLocationId toLocationId createdBy')
        .sort({ createdAt: -1 });
      return stockMovements.map(movement => movement.toObject());
    } catch (error) {
      console.error("Error getting all stock movements:", error);
      throw error;
    }
  }
}

export const storage = new Storage();
