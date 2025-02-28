import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string; // For subdomain (e.g., companyname.saasdomain.com)
  domain: string; // Custom domain if any
  email: string;
  phone: string;
  logo: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subscription: {
    tierId: Schema.Types.ObjectId;
    status: 'active' | 'inactive' | 'trial' | 'expired' | 'canceled';
    startDate: Date;
    endDate: Date;
    trialEndsAt: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    paymentMethod: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
  };
  usage: {
    users: number;
    storage: number; // in MB
    products: number;
    customers: number;
    apiRequests: number;
    lastUpdated: Date;
  };
  settings: {
    theme: string;
    timezone: string;
    currency: string;
    language: string;
    taxRate: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: Schema.Types.ObjectId; // Reference to the user who owns this company
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  domain: { type: String, unique: true, sparse: true },
  email: { type: String, required: true },
  phone: { type: String },
  logo: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  subscription: {
    tierId: { type: Schema.Types.ObjectId, ref: 'SubscriptionTier' },
    status: { type: String, enum: ['active', 'inactive', 'trial', 'expired', 'canceled'], default: 'trial' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    trialEndsAt: { type: Date },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    paymentMethod: { type: String },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String }
  },
  usage: {
    users: { type: Number, default: 0 },
    storage: { type: Number, default: 0 },
    products: { type: Number, default: 0 },
    customers: { type: Number, default: 0 },
    apiRequests: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  settings: {
    theme: { type: String, default: 'light' },
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    taxRate: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

// Indexes
CompanySchema.index({ slug: 1 }, { unique: true });
CompanySchema.index({ domain: 1 }, { unique: true, sparse: true });
CompanySchema.index({ ownerId: 1 });
CompanySchema.index({ 'subscription.status': 1 });
CompanySchema.index({ 'subscription.endDate': 1 });
CompanySchema.index({ isActive: 1 });

const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;