
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: Schema.Types.ObjectId;
  userType: 'admin' | 'subscriber' | 'system';
  companyId?: Schema.Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  metadata: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userType: { type: String, enum: ['admin', 'subscriber', 'system'], required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String },
  changes: [{
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed }
  }],
  metadata: { type: Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Indexes
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ companyId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ timestamp: 1 });
AuditLogSchema.index({ timestamp: -1 }); // For most recent queries
AuditLogSchema.index({ companyId: 1, timestamp: -1 });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
