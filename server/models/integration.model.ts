
import mongoose, { Schema, Document } from 'mongoose';
import { AppError } from '../utils/error';
import { encryption } from '../utils/encryption';

export interface IIntegration extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  type: string;
  config: any;
  credentials: any;
  status: string;
  lastSyncAt?: Date;
  errorMessage?: string;
  isEnabled: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'email',
      'sms',
      'push',
      'messenger',
      'discord',
      'whatsapp',
      'telegram',
      'facebook',
      'twitter',
      'linkedin',
      'instagram',
      'tiktok',
      'cloud_storage',
      'payment_gateway',
      'shipping',
      'accounting',
      'erp',
      'custom'
    ]
  },
  config: { type: Schema.Types.Mixed, default: {} },
  credentials: { type: Schema.Types.Mixed, default: {} },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'error', 'pending', 'connected'],
    default: 'inactive'
  },
  lastSyncAt: { type: Date },
  errorMessage: { type: String },
  isEnabled: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Encrypt sensitive credential data before saving
IntegrationSchema.pre('save', async function(next) {
  if (this.isModified('credentials') && this.credentials) {
    try {
      // Convert to string for encryption
      const credentialsStr = JSON.stringify(this.credentials);
      // Encrypt credentials
      this.credentials = await encryption.encrypt(credentialsStr);
    } catch (error) {
      return next(new AppError('Failed to encrypt integration credentials', 500));
    }
  }
  next();
});

// Decrypt sensitive credential data when fetched
IntegrationSchema.methods.getDecryptedCredentials = async function() {
  if (!this.credentials) return {};
  
  try {
    const decrypted = await encryption.decrypt(this.credentials);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to decrypt integration credentials:', error);
    return {};
  }
};

// Indexes for faster lookups
IntegrationSchema.index({ companyId: 1, type: 1 });
IntegrationSchema.index({ companyId: 1, status: 1 });
IntegrationSchema.index({ companyId: 1, name: 1 }, { unique: true });

const Integration = mongoose.model<IIntegration>('Integration', IntegrationSchema);

export default Integration;
