
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionTier extends Document {
  name: string;
  key: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  limits: {
    users: number;
    storage: number; // in MB
    productsLimit: number;
    locationsLimit: number;
    customersLimit: number;
    apiRequestsPerDay: number;
  };
  features: string[]; // Feature keys included in this tier
  isActive: boolean;
  order: number; // Display order
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionTierSchema = new Schema<ISubscriptionTier>({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    monthly: { type: Number, required: true },
    yearly: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  limits: {
    users: { type: Number, required: true },
    storage: { type: Number, required: true },
    productsLimit: { type: Number, required: true },
    locationsLimit: { type: Number, required: true },
    customersLimit: { type: Number, required: true },
    apiRequestsPerDay: { type: Number, required: true }
  },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
SubscriptionTierSchema.index({ key: 1 }, { unique: true });
SubscriptionTierSchema.index({ isActive: 1 });
SubscriptionTierSchema.index({ 'price.monthly': 1 });

const SubscriptionTier = mongoose.model<ISubscriptionTier>('SubscriptionTier', SubscriptionTierSchema);

export default SubscriptionTier;
