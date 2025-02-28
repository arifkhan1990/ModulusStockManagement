
import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemLog extends Document {
  companyId: Schema.Types.ObjectId;
  action: string;
  entityType?: string;
  entityId?: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  details?: object;
  ipAddress?: string;
  timestamp: Date;
}

const SystemLogSchema = new Schema<ISystemLog>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  action: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Indexes for faster lookups
SystemLogSchema.index({ companyId: 1, timestamp: -1 });
SystemLogSchema.index({ userId: 1 });
SystemLogSchema.index({ action: 1 });
SystemLogSchema.index({ entityType: 1, entityId: 1 });

const SystemLog = mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);

export default SystemLog;
