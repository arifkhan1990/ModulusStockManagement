
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  provider?: string;
  providerId?: string;
  role: string;
  phone?: string;
  position?: string;
  department?: string;
  avatar?: string;
  permissions?: string[];
  preferredLocations?: Schema.Types.ObjectId[];
  lastLogin?: Date;
  status: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  preferences?: {
    language?: string;
    theme?: string;
    timezone?: string;
    dateFormat?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      inApp?: boolean;
    }
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      default: 'local',
    },
    providerId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff', 'viewer', 'customer', 'supplier'],
      default: 'staff',
    },
    phone: {
      type: String,
    },
    position: {
      type: String,
    },
    department: {
      type: String,
    },
    avatar: {
      type: String,
    },
    permissions: [{
      type: String,
    }],
    preferredLocations: [{
      type: Schema.Types.ObjectId,
      ref: 'Location',
    }],
    lastLogin: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'active',
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
    },
    businessSize: { 
      type: String, 
      enum: ['small', 'medium', 'large'], 
      default: 'small' 
    },
    businessType: { 
      type: String 
    },
    preferences: {
      language: { type: String, default: 'en' },
      theme: { type: String, default: 'light' },
      timezone: { type: String, default: 'UTC' },
      dateFormat: { type: String, default: 'MM/DD/YYYY' },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true },
      }
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
