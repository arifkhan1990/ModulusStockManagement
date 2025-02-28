
import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  companyId: Schema.Types.ObjectId;
  date: Date;
  summary: {
    activeUsers: number;
    newUsers: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  features: {
    key: string;
    usageCount: number;
    totalTime: number; // Time spent in minutes
  }[];
  pageViews: {
    path: string;
    count: number;
  }[];
  system: {
    apiCalls: number;
    errors: number;
    averageResponseTime: number; // in ms
  };
}

const AnalyticsSchema = new Schema<IAnalytics>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  date: { type: Date, required: true },
  summary: {
    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
  },
  features: [{
    key: { type: String, required: true },
    usageCount: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }
  }],
  pageViews: [{
    path: { type: String, required: true },
    count: { type: Number, default: 0 }
  }],
  system: {
    apiCalls: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 }
  }
});

// Compound index for date-based lookups per company
AnalyticsSchema.index({ companyId: 1, date: 1 }, { unique: true });
AnalyticsSchema.index({ date: 1 });
AnalyticsSchema.index({ 'features.key': 1 });

const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
