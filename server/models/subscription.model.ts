
import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  duration: number; // in months
  price: number;
  features: {
    maxUsers: number;
    maxProducts: number;
    maxLocations: number;
    advancedReporting: boolean;
    apiAccess: boolean;
    emailSupport: boolean;
    phoneSupport: boolean;
    dedicatedAccount: boolean;
    customization: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      required: true,
      enum: ['Monthly', 'Quarterly', 'Biannual', 'Annual'],
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      maxUsers: { type: Number, default: 5 },
      maxProducts: { type: Number, default: 1000 },
      maxLocations: { type: Number, default: 3 },
      advancedReporting: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      emailSupport: { type: Boolean, default: true },
      phoneSupport: { type: Boolean, default: false },
      dedicatedAccount: { type: Boolean, default: false },
      customization: { type: Boolean, default: false },
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

// Add indexes
SubscriptionPlanSchema.index({ name: 1 });
SubscriptionPlanSchema.index({ isActive: 1 });

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;
