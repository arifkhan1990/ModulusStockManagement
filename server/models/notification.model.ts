
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  companyId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  recipientType: string; // 'subscriber', 'customer', 'employee'
  recipientId: Schema.Types.ObjectId;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: string; // 'email', 'push', 'sms', 'messenger', 'discord', 'whatsapp', 'telegram'
  eventType: string; // 'product_added', 'order_placed', 'payment_due', etc.
  title: string;
  content: string;
  status: string; // 'pending', 'sent', 'delivered', 'failed'
  errorMessage?: string;
  retryCount: number;
  metadata: any;
  referenceId?: Schema.Types.ObjectId; // reference to order, invoice, etc.
  referenceType?: string; // 'order', 'invoice', 'product', etc.
  isRead: boolean;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientType: { 
    type: String, 
    required: true, 
    enum: ['subscriber', 'customer', 'employee'] 
  },
  recipientId: { type: Schema.Types.ObjectId, required: true },
  recipientEmail: { type: String },
  recipientPhone: { type: String },
  channel: { 
    type: String, 
    required: true,
    enum: ['email', 'push', 'sms', 'messenger', 'discord', 'whatsapp', 'telegram'] 
  },
  eventType: { 
    type: String, 
    required: true,
    enum: [
      'product_added', 
      'order_placed', 
      'order_shipped',
      'order_delivered',
      'payment_received',
      'payment_due',
      'payment_overdue',
      'invoice_created',
      'invoice_shared',
      'report_generated',
      'report_shared',
      'low_stock',
      'support_ticket_created',
      'support_ticket_resolved',
      'custom'
    ]
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  errorMessage: { type: String },
  retryCount: { type: Number, default: 0 },
  metadata: { type: Schema.Types.Mixed, default: {} },
  referenceId: { type: Schema.Types.ObjectId },
  referenceType: { type: String },
  isRead: { type: Boolean, default: false },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
NotificationSchema.index({ companyId: 1, userId: 1 });
NotificationSchema.index({ companyId: 1, recipientId: 1 });
NotificationSchema.index({ companyId: 1, eventType: 1 });
NotificationSchema.index({ companyId: 1, status: 1 });
NotificationSchema.index({ companyId: 1, channel: 1 });
NotificationSchema.index({ companyId: 1, createdAt: 1 });
NotificationSchema.index({ referenceId: 1, referenceType: 1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
