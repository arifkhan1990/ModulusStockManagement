
import mongoose, { Schema, Document } from 'mongoose';

export interface IIntegration extends Document {
  companyId: Schema.Types.ObjectId;
  provider: string; // e.g., 'quickbooks', 'mailchimp', 'stripe'
  name: string;
  description?: string;
  isActive: boolean;
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    endpoint?: string;
    [key: string]: any;
  };
  settings: Record<string, any>;
  lastSyncAt?: Date;
  syncStatus?: 'success' | 'failed' | 'in_progress';
  syncError?: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  provider: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  credentials: {
    apiKey: { type: String },
    clientId: { type: String },
    clientSecret: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    endpoint: { type: String },
    _id: false
  },
  settings: { type: Map, of: Schema.Types.Mixed },
  lastSyncAt: { type: Date },
  syncStatus: {
    type: String,
    enum: ['success', 'failed', 'in_progress']
  },
  syncError: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
IntegrationSchema.index({ companyId: 1, provider: 1 }, { unique: true });
IntegrationSchema.index({ companyId: 1, isActive: 1 });

const Integration = mongoose.model<IIntegration>('Integration', IntegrationSchema);

export default Integration;
