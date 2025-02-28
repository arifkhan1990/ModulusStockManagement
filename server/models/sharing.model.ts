
import mongoose, { Schema, Document } from 'mongoose';

export interface ISharing extends Document {
  companyId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  documentId: Schema.Types.ObjectId;
  documentType: string; // 'invoice', 'report', etc.
  channel: string; // 'facebook', 'messenger', 'twitter', 'linkedin', 'discord', 'email', etc.
  sharingUrl: string;
  shortUrl?: string;
  accessToken: string;
  message?: string;
  expiresAt: Date;
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: Date;
  status: string;
  statusMessage?: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

const SharingSchema = new Schema<ISharing>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: Schema.Types.ObjectId, required: true },
  documentType: { 
    type: String, 
    required: true,
    enum: ['invoice', 'report', 'order', 'product', 'customer', 'payment']
  },
  channel: { 
    type: String, 
    required: true,
    enum: [
      'facebook', 
      'messenger', 
      'twitter', 
      'linkedin', 
      'discord', 
      'email',
      'whatsapp',
      'instagram',
      'tiktok',
      'direct_link'
    ] 
  },
  sharingUrl: { type: String, required: true },
  shortUrl: { type: String },
  accessToken: { type: String, required: true },
  message: { type: String },
  expiresAt: { type: Date, required: true },
  viewCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  lastViewedAt: { type: Date },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'expired', 'revoked', 'error'],
    default: 'active'
  },
  statusMessage: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
SharingSchema.index({ companyId: 1, documentId: 1 });
SharingSchema.index({ companyId: 1, userId: 1 });
SharingSchema.index({ accessToken: 1 }, { unique: true });
SharingSchema.index({ shortUrl: 1 });
SharingSchema.index({ expiresAt: 1 });

const Sharing = mongoose.model<ISharing>('Sharing', SharingSchema);

export default Sharing;
