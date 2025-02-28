import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  companyId?: Schema.Types.ObjectId; // For subscriber users
  roleIds: Schema.Types.ObjectId[]; // Multiple roles support
  type: 'system_admin' | 'company_admin' | 'company_user'; // System admins are SaaS admins
  isActive: boolean;
  isSuperAdmin: boolean; // Only for system admins with full access
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId?: string;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  phone: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  roleIds: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  type: { 
    type: String, 
    enum: ['system_admin', 'company_admin', 'company_user'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  isSuperAdmin: { type: Boolean, default: false },
  preferences: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    }
  },
  lastLoginAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  stripeCustomerId: { type: String }
});

// Indexes
// Note: email field index is already defined in the schema
UserSchema.index({ companyId: 1 });
UserSchema.index({ type: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;