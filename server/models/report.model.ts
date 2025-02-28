
import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  name: string;
  type: string; // inventory, sales, purchase, etc.
  description?: string;
  query?: object;
  parameters?: object;
  format?: string; // pdf, csv, excel, etc.
  schedule?: {
    frequency: string; // daily, weekly, monthly, etc.
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
    email?: string[];
    lastRun?: Date;
    nextRun?: Date;
  };
  createdBy: Schema.Types.ObjectId;
  lastRunBy?: Schema.Types.ObjectId;
  lastRunDate?: Date;
  isTemplate: boolean;
  isPublic: boolean;
  isSystem: boolean;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['inventory', 'sales', 'purchase', 'customer', 'supplier', 'product', 'movement', 'financial', 'custom']
  },
  description: { type: String },
  query: { type: Object },
  parameters: { type: Object },
  format: { type: String, enum: ['pdf', 'csv', 'excel', 'html', 'json'], default: 'pdf' },
  schedule: {
    frequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'] },
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday, 6 = Saturday
    dayOfMonth: { type: Number, min: 1, max: 31 },
    time: { type: String },
    email: [{ type: String }],
    lastRun: { type: Date },
    nextRun: { type: Date }
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastRunBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastRunDate: { type: Date },
  isTemplate: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  isSystem: { type: Boolean, default: false },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for faster lookups
ReportSchema.index({ name: 1 });
ReportSchema.index({ type: 1 });
ReportSchema.index({ isSystem: 1 });
ReportSchema.index({ isTemplate: 1 });

const Report = mongoose.model<IReport>('Report', ReportSchema);

export default Report;
