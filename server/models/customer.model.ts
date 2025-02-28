
import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  taxId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  customerType?: string; // retail, wholesale, etc.
  paymentTerms?: string;
  creditLimit?: number;
  discountRate?: number;
  tags?: string[];
  notes?: string;
  salesChannelId?: Schema.Types.ObjectId;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  taxId: { type: String },
  billingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  customerType: { type: String },
  paymentTerms: { type: String },
  creditLimit: { type: Number },
  discountRate: { type: Number },
  tags: [{ type: String }],
  notes: { type: String },
  salesChannelId: { type: Schema.Types.ObjectId, ref: 'SalesChannel' },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for faster lookups
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ name: 1 });
CustomerSchema.index({ customerType: 1 });
CustomerSchema.index({ 'billingAddress.country': 1 });

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
