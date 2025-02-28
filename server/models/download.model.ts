
import mongoose, { Schema, Document } from 'mongoose';

export interface IDownload extends Document {
  companyId: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId;
  documentId: Schema.Types.ObjectId;
  documentType: string; // 'invoice', 'report', etc.
  sharingId?: Schema.Types.ObjectId;
  format: string; // 'pdf', 'csv', 'xlsx', 'json'
  fileName: string;
  fileUrl: string;
  fileSize: number;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  expiresAt: Date;
  downloadedAt?: Date;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

const DownloadSchema = new Schema<IDownload>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  documentId: { type: Schema.Types.ObjectId, required: true },
  documentType: { 
    type: String, 
    required: true,
    enum: ['invoice', 'report', 'order', 'product', 'customer', 'payment']
  },
  sharingId: { type: Schema.Types.ObjectId, ref: 'Sharing' },
  format: { 
    type: String, 
    required: true,
    enum: ['pdf', 'csv', 'xlsx', 'json']
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  status: { 
    type: String, 
    required: true,
    enum: ['created', 'downloaded', 'expired', 'error'],
    default: 'created'
  },
  expiresAt: { type: Date, required: true },
  downloadedAt: { type: Date },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
DownloadSchema.index({ companyId: 1, documentId: 1 });
DownloadSchema.index({ companyId: 1, userId: 1 });
DownloadSchema.index({ sharingId: 1 });
DownloadSchema.index({ expiresAt: 1 });
DownloadSchema.index({ fileUrl: 1 });

const Download = mongoose.model<IDownload>('Download', DownloadSchema);

export default Download;
