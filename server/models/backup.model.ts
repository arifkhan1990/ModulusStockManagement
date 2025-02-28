
import mongoose, { Schema, Document } from 'mongoose';

export interface IBackup extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  backupType: 'manual' | 'scheduled';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dataTypes: string[]; // Array of data types included in backup (e.g., 'inventory', 'customers', 'invoices')
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  errorMessage?: string;
}

const BackupSchema = new Schema<IBackup>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  backupType: { 
    type: String, 
    required: true, 
    enum: ['manual', 'scheduled'],
    default: 'manual'
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  dataTypes: [{ type: String, required: true }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  expiresAt: { type: Date },
  errorMessage: { type: String }
});

// Indexes for faster lookups
BackupSchema.index({ companyId: 1, status: 1 });
BackupSchema.index({ companyId: 1, createdAt: 1 });
BackupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup

const Backup = mongoose.model<IBackup>('Backup', BackupSchema);

export default Backup;
