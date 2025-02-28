
import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  name: string;
  type: string; // low stock, expiry, etc.
  description?: string;
  criteria: {
    entity: string;
    field: string;
    condition: string;
    value: any;
  }[];
  isActive: boolean;
  severity: string; // info, warning, critical
  actions?: {
    notifyUsers?: Schema.Types.ObjectId[];
    notifyEmail?: string[];
    notifySMS?: string[];
    webhookUrl?: string;
    autoReorder?: boolean;
  };
  schedule?: {
    frequency: string; // daily, weekly, monthly, etc.
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
    lastRun?: Date;
    nextRun?: Date;
  };
  createdBy: Schema.Types.ObjectId;
  lastTriggeredAt?: Date;
  lastTriggeredData?: any;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['low_stock', 'reorder', 'expiry', 'movement', 'price_change', 'sales', 'custom']
  },
  description: { type: String },
  criteria: [{
    entity: { type: String, required: true },
    field: { type: String, required: true },
    condition: { 
      type: String, 
      required: true, 
      enum: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains', 'starts_with', 'ends_with', 'between', 'in', 'not_in']
    },
    value: { type: Schema.Types.Mixed, required: true }
  }],
  isActive: { type: Boolean, default: true },
  severity: { 
    type: String, 
    required: true,
    enum: ['info', 'warning', 'critical'],
    default: 'warning'
  },
  actions: {
    notifyUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    notifyEmail: [{ type: String }],
    notifySMS: [{ type: String }],
    webhookUrl: { type: String },
    autoReorder: { type: Boolean, default: false }
  },
  schedule: {
    frequency: { type: String, enum: ['realtime', 'hourly', 'daily', 'weekly', 'monthly'], default: 'realtime' },
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday, 6 = Saturday
    dayOfMonth: { type: Number, min: 1, max: 31 },
    time: { type: String },
    lastRun: { type: Date },
    nextRun: { type: Date }
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastTriggeredAt: { type: Date },
  lastTriggeredData: { type: Schema.Types.Mixed },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for faster lookups
AlertSchema.index({ type: 1 });
AlertSchema.index({ severity: 1 });
AlertSchema.index({ isActive: 1 });

const Alert = mongoose.model<IAlert>('Alert', AlertSchema);

export default Alert;
