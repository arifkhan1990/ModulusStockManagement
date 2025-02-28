import mongoose, { Schema, Document } from "mongoose";

export interface ISystemLog extends Document {
  companyId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: Schema.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const SystemLogSchema = new Schema<ISystemLog>({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g., 'create', 'update', 'delete', 'login', 'logout'
  entity: { type: String, required: true }, // e.g., 'product', 'order', 'invoice', 'user'
  entityId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed }, // Can contain any additional details
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for faster queries
SystemLogSchema.index({ companyId: 1 });
SystemLogSchema.index({ userId: 1 });
SystemLogSchema.index({ action: 1 });
SystemLogSchema.index({ entity: 1 });
SystemLogSchema.index({ entityId: 1 });
SystemLogSchema.index({ createdAt: 1 });
SystemLogSchema.index({ companyId: 1, createdAt: -1 }); // For company-specific recent activity

const SystemLog = mongoose.model<ISystemLog>("SystemLog", SystemLogSchema);

export default SystemLog;
