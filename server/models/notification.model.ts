
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  companyId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  type: string; // e.g., 'low_stock', 'new_ticket', 'invoice_overdue'
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  resourceId?: Schema.Types.ObjectId;
  resourceType?: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

const NotificationSchema = new Schema<INotification>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String },
  resourceId: { type: Schema.Types.ObjectId },
  resourceType: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

// Indexes for faster lookups
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ companyId: 1, type: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
