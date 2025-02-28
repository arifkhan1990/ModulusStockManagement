
import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesChannel extends Document {
  name: string;
  type: string; // website, marketplace, retail store, etc.
  platformName?: string; // Amazon, eBay, etc.
  url?: string;
  apiCredentials?: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date;
  };
  status: string;
  commission?: number;
  commissionType?: string;
  taxRate?: number;
  currency?: string;
  defaultWarehouseId?: Schema.Types.ObjectId;
  syncSettings?: {
    syncInventory: boolean;
    syncOrders: boolean;
    syncProducts: boolean;
    syncPrices: boolean;
    autoFulfill: boolean;
    frequency: string;
    lastSync?: Date;
  };
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SalesChannelSchema = new Schema<ISalesChannel>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['website', 'marketplace', 'retail store', 'wholesale', 'b2b', 'social media', 'other']
  },
  platformName: { type: String },
  url: { type: String },
  apiCredentials: {
    clientId: { type: String },
    clientSecret: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date }
  },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'inactive', 'setup', 'pending approval'],
    default: 'setup'
  },
  commission: { type: Number },
  commissionType: { type: String, enum: ['percent', 'fixed'] },
  taxRate: { type: Number },
  currency: { type: String, default: 'USD' },
  defaultWarehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  syncSettings: {
    syncInventory: { type: Boolean, default: true },
    syncOrders: { type: Boolean, default: true },
    syncProducts: { type: Boolean, default: true },
    syncPrices: { type: Boolean, default: true },
    autoFulfill: { type: Boolean, default: false },
    frequency: { type: String, default: 'hourly' },
    lastSync: { type: Date }
  },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for faster lookups
SalesChannelSchema.index({ name: 1 });
SalesChannelSchema.index({ type: 1 });
SalesChannelSchema.index({ status: 1 });

const SalesChannel = mongoose.model<ISalesChannel>('SalesChannel', SalesChannelSchema);

export default SalesChannel;
