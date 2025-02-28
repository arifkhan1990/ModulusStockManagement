
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
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  companyId: z.string().optional(),
  type: z.enum(['system_admin', 'company_admin', 'company_user']),
  isActive: z.boolean().default(true),
  isSuperAdmin: z.boolean().default(false),
  preferences: z.object({
    theme: z.string().default('light'),
    language: z.string().default('en'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      inApp: z.boolean().default(true)
    })
  }).optional()
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

export const insertCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertCustomerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  companyId: z.string(),
  notes: z.string().optional(),
});

export const insertOrderSchema = z.object({
  orderNumber: z.string(),
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })),
  status: z.string(),
  totalAmount: z.number(),
  paymentStatus: z.string(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
});

export const insertWarehouseSchema = z.object({
  name: z.string(),
  address: z.string(),
  manager: z.string().optional(),
  contactNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertPurchaseOrderSchema = z.object({
  poNumber: z.string(),
  supplierId: z.string(),
  status: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })),
  totalAmount: z.number(),
  expectedDeliveryDate: z.date().optional(),
  notes: z.string().optional(),
});

export const insertSalesChannelSchema = z.object({
  name: z.string(),
  type: z.string(),
  configuration: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

export const insertReportSchema = z.object({
  name: z.string(),
  type: z.string(),
  parameters: z.record(z.any()).optional(),
  generatedBy: z.string(),
  resultUrl: z.string().optional(),
});

export const insertAlertSchema = z.object({
  type: z.string(),
  message: z.string(),
  severity: z.string(),
  status: z.string().default('unread'),
  targetUsers: z.array(z.string()).optional(),
});

export const insertPaymentSchema = z.object({
  companyId: z.string(),
  orderId: z.string(),
  orderNumber: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
  paymentGateway: z.string().optional(),
  transactionId: z.string().optional(),
  status: z.string().default('pending'),
  notes: z.string().optional(),
});

export const insertCompanySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  subscriptionTierId: z.string(),
  subscriptionStatus: z.string().default('active'),
  logo: z.string().optional(),
  domain: z.string().optional(),
  size: z.string().optional(),
  industry: z.string().optional(),
});

export const insertSubscriptionTierSchema = z.object({
  name: z.string(),
  price: z.number(),
  billingCycle: z.string(),
  features: z.array(z.string()),
  isActive: z.boolean().default(true),
  maxUsers: z.number().optional(),
  maxProducts: z.number().optional(),
  maxLocations: z.number().optional(),
});

export const insertCompanyPreferenceSchema = z.object({
  companyId: z.string(),
  theme: z.string().default('light'),
  currency: z.string().default('USD'),
  dateFormat: z.string().default('MM/DD/YYYY'),
  timeFormat: z.string().default('12h'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
});

export const insertFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  isCore: z.boolean().default(false),
  tierLevels: z.array(z.string()),
});

export const insertFeatureToggleSchema = z.object({
  featureId: z.string(),
  companyId: z.string().optional(),
  isEnabled: z.boolean().default(true),
  configOptions: z.record(z.any()).optional(),
});

export const insertInvoiceSchema = z.object({
  invoiceNumber: z.string(),
  orderId: z.string().optional(),
  customerId: z.string(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    taxRate: z.number().optional(),
  })),
  subtotal: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  status: z.string().default('draft'),
  dueDate: z.date(),
  notes: z.string().optional(),
});

export const insertInvoiceTemplateSchema = z.object({
  name: z.string(),
  companyId: z.string(),
  template: z.string(),
  isDefault: z.boolean().default(false),
});

export const insertPageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  status: z.string().default('draft'),
  author: z.string(),
  isPublic: z.boolean().default(false),
});

export const insertSupportTicketSchema = z.object({
  subject: z.string(),
  description: z.string(),
  userId: z.string(),
  companyId: z.string().optional(),
  status: z.string().default('open'),
  priority: z.string().default('medium'),
  category: z.string().optional(),
});

export const insertNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  isRead: z.boolean().default(false),
  linkUrl: z.string().optional(),
});

export const insertNotificationPreferenceSchema = z.object({
  userId: z.string(),
  type: z.string(),
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  inApp: z.boolean().default(true),
});

export const insertSharingSchema = z.object({
  resourceType: z.string(),
  resourceId: z.string(),
  sharedWith: z.string(),
  permissions: z.array(z.string()),
  expiresAt: z.date().optional(),
});

export const insertIntegrationSchema = z.object({
  companyId: z.string(),
  type: z.string(),
  name: z.string(),
  config: z.record(z.any()),
  status: z.string().default('active'),
});

export const insertSystemLogSchema = z.object({
  level: z.string(),
  message: z.string(),
  source: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const insertBackupSchema = z.object({
  companyId: z.string().optional(),
  type: z.string(),
  storageUrl: z.string(),
  status: z.string(),
  size: z.number().optional(),
  createdBy: z.string(),
});

export const insertAnalyticsSchema = z.object({
  companyId: z.string().optional(),
  type: z.string(),
  period: z.string(),
  data: z.record(z.any()),
});

export const insertAuditLogSchema = z.object({
  userId: z.string(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  details: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
});

export const insertRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.string()),
  companyId: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const insertDownloadSchema = z.object({
  userId: z.string(),
  resourceType: z.string(),
  resourceId: z.string().optional(),
  fileUrl: z.string(),
  status: z.string().default('pending'),
  expiresAt: z.date().optional(),
});

// MongoDB Schemas and Models
// User Schema
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  companyId?: Schema.Types.ObjectId;
  roleIds: Schema.Types.ObjectId[];
  type: 'system_admin' | 'company_admin' | 'company_user';
  isActive: boolean;
  isSuperAdmin: boolean;
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  roleIds: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  type: { 
    type: String, 
    enum: ['system_admin', 'company_admin', 'company_user'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  isSuperAdmin: { type: Boolean, default: false },
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    }
  },
  lastLoginAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  stripeCustomerId: { type: String }
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

// Category Schema
export interface ICategory extends Document {
  name: string;
  description?: string;
  parentId?: Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Customer Schema
export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  companyId: Schema.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Order Schema
export interface IOrder extends Document {
  orderNumber: string;
  customerId: Schema.Types.ObjectId;
  items: Array<{
    productId: Schema.Types.ObjectId;
    quantity: number;
    unitPrice: number;
  }>;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
  }],
  status: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  shippingAddress: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Warehouse Schema
export interface IWarehouse extends Document {
  name: string;
  address: string;
  manager?: string;
  contactNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema = new Schema<IWarehouse>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  manager: { type: String },
  contactNumber: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Purchase Order Schema
export interface IPurchaseOrder extends Document {
  poNumber: string;
  supplierId: Schema.Types.ObjectId;
  status: string;
  items: Array<{
    productId: Schema.Types.ObjectId;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  expectedDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  poNumber: { type: String, required: true, unique: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  status: { type: String, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  expectedDeliveryDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sales Channel Schema
export interface ISalesChannel extends Document {
  name: string;
  type: string;
  configuration?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SalesChannelSchema = new Schema<ISalesChannel>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  configuration: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Report Schema
export interface IReport extends Document {
  name: string;
  type: string;
  parameters?: Record<string, any>;
  generatedBy: Schema.Types.ObjectId;
  resultUrl?: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  parameters: { type: Schema.Types.Mixed },
  generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resultUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Alert Schema
export interface IAlert extends Document {
  type: string;
  message: string;
  severity: string;
  status: string;
  targetUsers?: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  type: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, default: 'unread' },
  targetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

// Payment Schema
export interface IPayment extends Document {
  companyId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  paymentGateway?: string;
  transactionId?: string;
  status: string;
  paymentDate: Date;
  notes?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
  businessSize?: string;
  businessType?: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  orderNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentGateway: { type: String },
  transactionId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending', required: true },
  paymentDate: { type: Date, default: Date.now },
  notes: { type: String },
  receiptUrl: { type: String },
  metadata: { type: Schema.Types.Mixed },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Company Schema
export interface ICompany extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionTierId: Schema.Types.ObjectId;
  subscriptionStatus: string;
  logo?: string;
  domain?: string;
  size?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  subscriptionTierId: { type: Schema.Types.ObjectId, ref: 'SubscriptionTier', required: true },
  subscriptionStatus: { type: String, default: 'active' },
  logo: { type: String },
  domain: { type: String },
  size: { type: String },
  industry: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Subscription Tier Schema
export interface ISubscriptionTier extends Document {
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  isActive: boolean;
  maxUsers?: number;
  maxProducts?: number;
  maxLocations?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionTierSchema = new Schema<ISubscriptionTier>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, required: true },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  maxUsers: { type: Number },
  maxProducts: { type: Number },
  maxLocations: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Company Preference Schema
export interface ICompanyPreference extends Document {
  companyId: Schema.Types.ObjectId;
  theme: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  timezone: string;
  updatedAt: Date;
}

const CompanyPreferenceSchema = new Schema<ICompanyPreference>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  theme: { type: String, default: 'light' },
  currency: { type: String, default: 'USD' },
  dateFormat: { type: String, default: 'MM/DD/YYYY' },
  timeFormat: { type: String, default: '12h' },
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  updatedAt: { type: Date, default: Date.now },
});

// Feature Schema
export interface IFeature extends Document {
  name: string;
  description: string;
  isCore: boolean;
  tierLevels: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isCore: { type: Boolean, default: false },
  tierLevels: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Feature Toggle Schema
export interface IFeatureToggle extends Document {
  featureId: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
  isEnabled: boolean;
  configOptions?: Record<string, any>;
  updatedAt: Date;
}

const FeatureToggleSchema = new Schema<IFeatureToggle>({
  featureId: { type: Schema.Types.ObjectId, ref: 'Feature', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  isEnabled: { type: Boolean, default: true },
  configOptions: { type: Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now },
});

// Invoice Schema
export interface IInvoice extends Document {
  invoiceNumber: string;
  orderId?: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { type: String, required: true, unique: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    taxRate: { type: Number }
  }],
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'draft' },
  dueDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Invoice Template Schema
export interface IInvoiceTemplate extends Document {
  name: string;
  companyId: Schema.Types.ObjectId;
  template: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceTemplateSchema = new Schema<IInvoiceTemplate>({
  name: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  template: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Page Schema
export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  status: string;
  author: Schema.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  status: { type: String, default: 'draft' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Support Ticket Schema
export interface ISupportTicket extends Document {
  subject: string;
  description: string;
  userId: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
  status: string;
  priority: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  status: { type: String, default: 'open' },
  priority: { type: String, default: 'medium' },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Notification Schema
export interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  linkUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Notification Preference Schema
export interface INotificationPreference extends Document {
  userId: Schema.Types.ObjectId;
  type: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  updatedAt: Date;
}

const NotificationPreferenceSchema = new Schema<INotificationPreference>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  inApp: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

// Sharing Schema
export interface ISharing extends Document {
  resourceType: string;
  resourceId: Schema.Types.ObjectId;
  sharedWith: Schema.Types.ObjectId;
  permissions: string[];
  expiresAt?: Date;
  createdAt: Date;
}

const SharingSchema = new Schema<ISharing>({
  resourceType: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId, required: true },
  sharedWith: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: [{ type: String, required: true }],
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Integration Schema
export interface IIntegration extends Document {
  companyId: Schema.Types.ObjectId;
  type: string;
  name: string;
  config: Record<string, any>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  config: { type: Schema.Types.Mixed, required: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// System Log Schema
export interface ISystemLog extends Document {
  level: string;
  message: string;
  source: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const SystemLogSchema = new Schema<ISystemLog>({
  level: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

// Backup Schema
export interface IBackup extends Document {
  companyId?: Schema.Types.ObjectId;
  type: string;
  storageUrl: string;
  status: string;
  size?: number;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const BackupSchema = new Schema<IBackup>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  type: { type: String, required: true },
  storageUrl: { type: String, required: true },
  status: { type: String, required: true },
  size: { type: Number },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Analytics Schema
export interface IAnalytics extends Document {
  companyId?: Schema.Types.ObjectId;
  type: string;
  period: string;
  data: Record<string, any>;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  type: { type: String, required: true },
  period: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Audit Log Schema
export interface IAuditLog extends Document {
  userId: Schema.Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId: Schema.Types.ObjectId;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId, required: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Role Schema
export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: string[];
  companyId?: Schema.Types.ObjectId;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: String, required: true }],
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Download Schema
export interface IDownload extends Document {
  userId: Schema.Types.ObjectId;
  resourceType: string;
  resourceId?: Schema.Types.ObjectId;
  fileUrl: string;
  status: string;
  expiresAt?: Date;
  createdAt: Date;
}

const DownloadSchema = new Schema<IDownload>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId },
  fileUrl: { type: String, required: true },
  status: { type: String, default: 'pending' },
  expiresAt: { type: Date },
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
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Warehouse = mongoose.models.Warehouse || mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
export const SalesChannel = mongoose.models.SalesChannel || mongoose.model<ISalesChannel>('SalesChannel', SalesChannelSchema);
export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
export const Alert = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
export const SubscriptionTier = mongoose.models.SubscriptionTier || mongoose.model<ISubscriptionTier>('SubscriptionTier', SubscriptionTierSchema);
export const CompanyPreference = mongoose.models.CompanyPreference || mongoose.model<ICompanyPreference>('CompanyPreference', CompanyPreferenceSchema);
export const Feature = mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);
export const FeatureToggle = mongoose.models.FeatureToggle || mongoose.model<IFeatureToggle>('FeatureToggle', FeatureToggleSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
export const InvoiceTemplate = mongoose.models.InvoiceTemplate || mongoose.model<IInvoiceTemplate>('InvoiceTemplate', InvoiceTemplateSchema);
export const Page = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
export const SupportTicket = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export const NotificationPreference = mongoose.models.NotificationPreference || mongoose.model<INotificationPreference>('NotificationPreference', NotificationPreferenceSchema);
export const Sharing = mongoose.models.Sharing || mongoose.model<ISharing>('Sharing', SharingSchema);
export const Integration = mongoose.models.Integration || mongoose.model<IIntegration>('Integration', IntegrationSchema);
export const SystemLog = mongoose.models.SystemLog || mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);
export const Backup = mongoose.models.Backup || mongoose.model<IBackup>('Backup', BackupSchema);
export const Analytics = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const Role = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);
export const Download = mongoose.models.Download || mongoose.model<IDownload>('Download', DownloadSchema);

// Export Zod schema types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type InsertSalesChannel = z.infer<typeof insertSalesChannelSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertSubscriptionTier = z.infer<typeof insertSubscriptionTierSchema>;
export type InsertCompanyPreference = z.infer<typeof insertCompanyPreferenceSchema>;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type InsertFeatureToggle = z.infer<typeof insertFeatureToggleSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertInvoiceTemplate = z.infer<typeof insertInvoiceTemplateSchema>;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertNotificationPreference = z.infer<typeof insertNotificationPreferenceSchema>;
export type InsertSharing = z.infer<typeof insertSharingSchema>;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type InsertBackup = z.infer<typeof insertBackupSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
