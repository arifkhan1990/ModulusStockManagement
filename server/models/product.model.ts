
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  description?: string;
  categoryId: Schema.Types.ObjectId;
  unitPrice: number;
  costPrice?: number;
  reorderPoint: number;
  reorderQuantity?: number;
  leadTime?: number; // in days
  upc?: string;
  ean?: string;
  isbn?: string;
  supplierId?: Schema.Types.ObjectId;
  preferredSupplierId?: Schema.Types.ObjectId;
  alternativeSuppliers?: Schema.Types.ObjectId[];
  brand?: string;
  manufacturer?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  shelfLife?: number; // in days
  hazardous?: boolean;
  refrigerated?: boolean;
  taxes?: {
    taxCode: string;
    rate: number;
  }[];
  images?: string[];
  attributes?: {
    [key: string]: any;
  };
  variants?: Schema.Types.ObjectId[];
  isParent?: boolean;
  parentId?: Schema.Types.ObjectId;
  variantAttributes?: string[];
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  barcode?: string;
  qrcode?: string;
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
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  unitPrice: { type: Number, required: true },
  costPrice: { type: Number },
  reorderPoint: { type: Number, required: true },
  reorderQuantity: { type: Number },
  leadTime: { type: Number },
  upc: { type: String },
  ean: { type: String },
  isbn: { type: String },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  preferredSupplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  alternativeSuppliers: [{ type: Schema.Types.ObjectId, ref: 'Supplier' }],
  brand: { type: String },
  manufacturer: { type: String },
  weight: { type: Number },
  weightUnit: { type: String, enum: ['kg', 'g', 'lb', 'oz'] },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, enum: ['cm', 'in', 'm', 'ft'] }
  },
  shelfLife: { type: Number },
  hazardous: { type: Boolean, default: false },
  refrigerated: { type: Boolean, default: false },
  taxes: [{
    taxCode: { type: String },
    rate: { type: Number }
  }],
  images: [{ type: String }],
  attributes: { type: Map, of: Schema.Types.Mixed },
  variants: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  isParent: { type: Boolean, default: false },
  parentId: { type: Schema.Types.ObjectId, ref: 'Product' },
  variantAttributes: [{ type: String }],
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  barcode: { type: String },
  qrcode: { type: String },
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
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for faster lookups
ProductSchema.index({ name: 1, sku: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ businessSize: 1, businessType: 1 });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    companyId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Company', 
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    sku: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    costPrice: { 
      type: Number,
      min: 0 
    },
    stockQuantity: { 
      type: Number, 
      required: true,
      default: 0 
    },
    lowStockThreshold: { 
      type: Number,
      default: 5 
    },
    category: { 
      type: String 
    },
    subcategory: { 
      type: String 
    },
    imageUrl: { 
      type: String 
    },
    tags: [{ 
      type: String 
    }],
    attributes: {
      type: Map,
      of: Schema.Types.Mixed
    },
    barcode: { 
      type: String 
    },
    weight: { 
      type: Number 
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      unit: { type: String, default: 'cm' }
    },
    taxRate: { 
      type: Number,
      default: 0 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active' 
    },
    locationIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Location' 
    }],
    isDigital: { 
      type: Boolean,
      default: false 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true
  }
);

// Ensure compound index for company + SKU uniqueness
ProductSchema.index({ companyId: 1, sku: 1 }, { unique: true });

// Other useful indexes
ProductSchema.index({ companyId: 1, name: 1 });
ProductSchema.index({ companyId: 1, category: 1 });
ProductSchema.index({ companyId: 1, status: 1 });
ProductSchema.index({ companyId: 1, stockQuantity: 1 }); // For low stock queries
ProductSchema.index({ companyId: 1, tags: 1 });
ProductSchema.index({ barcode: 1 });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
