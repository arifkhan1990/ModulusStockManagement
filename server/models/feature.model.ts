import mongoose, { Schema, Document } from "mongoose";

export interface IFeature extends Document {
  name: string;
  key: string;
  description: string;
  category: string;
  isEnabled: boolean;
  isGlobal: boolean;
  isMandatory: boolean;
  defaultSettings: Record<string, any>;
  dependencies: string[]; // Feature keys this feature depends on
  subscriptionTiers: string[]; // Which tiers have access to this feature
  rolloutPercentage: number; // For incremental rollouts (0-100)
  createdAt: Date;
  updatedAt: Date;
  version: string;
  order: number; // Default display order
  icon: string;
  tags: string[];
}

const FeatureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  isGlobal: { type: Boolean, default: false },
  isMandatory: { type: Boolean, default: false },
  defaultSettings: { type: Schema.Types.Mixed, default: {} },
  dependencies: [{ type: String }],
  subscriptionTiers: [{ type: String }],
  rolloutPercentage: { type: Number, default: 100, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  version: { type: String, default: "1.0.0" },
  order: { type: Number, default: 0 },
  icon: { type: String },
  tags: [{ type: String }],
});

// Indexes
FeatureSchema.index({ category: 1 });
FeatureSchema.index({ isEnabled: 1 });
FeatureSchema.index({ subscriptionTiers: 1 });

const Feature = mongoose.model<IFeature>("Feature", FeatureSchema);

export default Feature;
