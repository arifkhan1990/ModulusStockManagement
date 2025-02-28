
import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// MongoDB connection
export const connectToDatabase = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string().optional(),
  email: z.string().email(),
  name: z.string(),
  provider: z.string().default('local'),
  providerId: z.string().optional(),
  role: z.string().default('user'),
});

export const insertDemoRequestSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  companyName: z.string(),
  companySize: z.string(),
  message: z.string().optional(),
});

export const insertLocationSchema = z.object({
  name: z.string(),
  type: z.string(),
  address: z.string(),
  contactNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertSupplierSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  rating: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const insertProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  unitPrice: z.number(),
  reorderPoint: z.number(),
  supplierId: z.string().optional(),
});

export const insertInventorySchema = z.object({
  productId: z.string(),
  locationId: z.string(),
  quantity: z.number(),
  batchNumber: z.string().optional(),
  expiryDate: z.date().optional(),
});

export const insertStockMovementSchema = z.object({
  productId: z.string(),
  fromLocationId: z.string(),
  toLocationId: z.string().optional(),
  quantity: z.number(),
  type: z.string(),
  reference: z.string().optional(),
  reason: z.string().optional(),
  createdBy: z.string(),
});

// MongoDB Schemas and Models
// User Schema
export interface IUser extends Document {
  username: string;
  password?: string;
  email: string;
  name: string;
  provider: string;
  providerId?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  provider: { type: String, required: true, default: 'local' },
  providerId: { type: String },
  role: { type: String, required: true, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Demo Request Schema
export interface IDemoRequest extends Document {
  fullName: string;
  email: string;
  companyName: string;
  companySize: string;
  message?: string;
  createdAt: Date;
}

const DemoRequestSchema = new Schema<IDemoRequest>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  companySize: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Location Schema
export interface ILocation extends Document {
  name: string;
  type: string;
  address: string;
  contactNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Supplier Schema
export interface ISupplier extends Document {
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  rating?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String },
  address: { type: String },
  rating: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Product Schema
export interface IProduct extends Document {
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  reorderPoint: number;
  supplierId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  reorderPoint: { type: Number, required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Inventory Schema
export interface IInventory extends Document {
  productId: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  quantity: number;
  batchNumber?: string;
  expiryDate?: Date;
  lastUpdated: Date;
}

const InventorySchema = new Schema<IInventory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  batchNumber: { type: String },
  expiryDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
});

// Stock Movement Schema
export interface IStockMovement extends Document {
  productId: Schema.Types.ObjectId;
  fromLocationId: Schema.Types.ObjectId;
  toLocationId?: Schema.Types.ObjectId;
  quantity: number;
  type: string;
  reference?: string;
  reason?: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  toLocationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  reference: { type: String },
  reason: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create and export models - checking if they exist first
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const DemoRequest = mongoose.models.DemoRequest || mongoose.model<IDemoRequest>('DemoRequest', DemoRequestSchema);
export const Location = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
export const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', SupplierSchema);
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const Inventory = mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);
export const StockMovement = mongoose.models.StockMovement || mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
