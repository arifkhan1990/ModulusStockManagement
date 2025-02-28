import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
  tags?: string[];
  attributes?: Map<string, any>;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  taxRate?: number;
  status: string; // active, inactive, discontinued
  locationIds?: Schema.Types.ObjectId[];
  isDigital: boolean;
  variantAttributes?: string[];
  businessSize: string; // small, medium, large
  businessType?: string;
  lastPurchasePrice?: number;
  lastPurchaseDate?: Date;
  isActive: boolean;
  isService: boolean;
  rating?: number;
  reviews?: {
    userId: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  costPrice: { type: Number },
  stockQuantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number },
  category: { type: String },
  subcategory: { type: String },
  imageUrl: { type: String },
  tags: [{ type: String }],
  attributes: { type: Map, of: Schema.Types.Mixed },
  barcode: { type: String },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, enum: ['cm', 'in', 'm'], default: 'cm' }
  },
  taxRate: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active' },
  locationIds: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  isDigital: { type: Boolean, default: false },
  variantAttributes: [{ type: String }],
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  lastPurchasePrice: { type: Number },
  lastPurchaseDate: { type: Date },
  isActive: { type: Boolean, default: true },
  isService: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5 },
  reviews: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for faster lookups
ProductSchema.index({ name: 1, sku: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ businessSize: 1, businessType: 1 });
ProductSchema.index({ companyId: 1 }); // For tenant isolation
ProductSchema.index({ companyId: 1, name: 1 }); // For name search within company
ProductSchema.index({ companyId: 1, sku: 1 }, { unique: true }); // Unique SKU within company
ProductSchema.index({ companyId: 1, barcode: 1 }); // For barcode scanning

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;