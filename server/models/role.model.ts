
import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  key: string;
  description: string;
  type: 'system' | 'subscriber'; // system = SaaS provider, subscriber = for companies
  companyId?: Schema.Types.ObjectId; // Only for subscriber roles
  permissions: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true },
  key: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['system', 'subscriber'], required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  permissions: [{ type: String }],
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for unique roles per company
RoleSchema.index({ companyId: 1, key: 1 }, { unique: true });
RoleSchema.index({ type: 1 });
RoleSchema.index({ isDefault: 1 });

const Role = mongoose.model<IRole>('Role', RoleSchema);

export default Role;
