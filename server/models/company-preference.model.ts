
import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyPreference extends Document {
  companyId: Schema.Types.ObjectId;
  features: {
    key: string;
    isEnabled: boolean;
    priority: number; // Lower number = higher priority
    settings: Record<string, any>; // Custom settings for this feature
  }[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
    favicon: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    messenger: boolean;
    discord: boolean;
    whatsapp: boolean;
    telegram: boolean;
  };
  sharing: {
    facebook: boolean;
    twitter: boolean;
    linkedin: boolean;
    instagram: boolean;
    tiktok: boolean;
  };
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  updatedAt: Date;
  updatedBy: Schema.Types.ObjectId;
}

const CompanyPreferenceSchema = new Schema<ICompanyPreference>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
  features: [{
    key: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
    priority: { type: Number, default: 10 },
    settings: { type: Schema.Types.Mixed, default: {} }
  }],
  branding: {
    primaryColor: { type: String, default: '#4f46e5' },
    secondaryColor: { type: String, default: '#f97316' },
    accentColor: { type: String, default: '#06b6d4' },
    logo: { type: String },
    favicon: { type: String }
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    messenger: { type: Boolean, default: false },
    discord: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    telegram: { type: Boolean, default: false }
  },
  sharing: {
    facebook: { type: Boolean, default: true },
    twitter: { type: Boolean, default: true },
    linkedin: { type: Boolean, default: true },
    instagram: { type: Boolean, default: false },
    tiktok: { type: Boolean, default: false }
  },
  defaultLanguage: { type: String, default: 'en' },
  defaultCurrency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'UTC' },
  dateFormat: { type: String, default: 'MM/DD/YYYY' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

// Indexes
CompanyPreferenceSchema.index({ companyId: 1 }, { unique: true });
CompanyPreferenceSchema.index({ 'features.key': 1 });

const CompanyPreference = mongoose.model<ICompanyPreference>('CompanyPreference', CompanyPreferenceSchema);

export default CompanyPreference;
