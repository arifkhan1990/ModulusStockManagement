
import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  businessType: string; // retail, manufacturing, wholesale, etc.
  businessSize: string; // small, medium, large
  maxUsers: number;
  maxProducts: number;
  maxLocations: number;
  subscriptionPlan: string; // monthly, quarterly, biannual, annual
  subscriptionStatus: string; // active, expired, trial
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  paymentHistory: Array<{
    amount: number;
    date: Date;
    method: string;
    reference: string;
  }>;
  settings: {
    logo?: string;
    primaryColor?: string;
    timezone?: string;
    currency?: string;
    language?: string;
    enableAdvancedFeatures?: boolean;
    enableApis?: boolean;
    enableReports?: boolean;
  };
  apiKey?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    businessSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "small",
    },
    maxUsers: {
      type: Number,
      default: 5, // Default limit based on plan
    },
    maxProducts: {
      type: Number,
      default: 1000, // Default limit based on plan
    },
    maxLocations: {
      type: Number,
      default: 3, // Default limit based on plan
    },
    subscriptionPlan: {
      type: String,
      enum: ["monthly", "quarterly", "biannual", "annual", "trial"],
      default: "trial",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "trial", "canceled"],
      default: "trial",
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionEndDate: {
      type: Date,
      required: true,
    },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        method: String,
        reference: String,
      },
    ],
    settings: {
      logo: String,
      primaryColor: String,
      timezone: { type: String, default: "UTC" },
      currency: { type: String, default: "USD" },
      language: { type: String, default: "en" },
      enableAdvancedFeatures: { type: Boolean, default: false },
      enableApis: { type: Boolean, default: false },
      enableReports: { type: Boolean, default: true },
    },
    apiKey: {
      type: String,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster lookups
CompanySchema.index({ name: 1 });
CompanySchema.index({ subscriptionStatus: 1 });
CompanySchema.index({ subscriptionEndDate: 1 });
CompanySchema.index({ businessSize: 1, businessType: 1 });
CompanySchema.index({ isActive: 1 });

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
