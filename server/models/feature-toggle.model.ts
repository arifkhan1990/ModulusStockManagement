
import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureToggle extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  enabled: boolean;
  updatedBy: Schema.Types.ObjectId;
  updatedAt: Date;
}

const FeatureToggleSchema = new Schema<IFeatureToggle>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  description: { type: String },
  enabled: { type: Boolean, default: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for company and feature name
FeatureToggleSchema.index({ companyId: 1, name: 1 }, { unique: true });

const FeatureToggle = mongoose.model<IFeatureToggle>('FeatureToggle', FeatureToggleSchema);

export default FeatureToggle;
import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureToggle extends Document {
  companyId: Schema.Types.ObjectId;
  feature: string;
  enabled: boolean;
  configuration?: any;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureToggleSchema = new Schema<IFeatureToggle>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  feature: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  configuration: { type: Schema.Types.Mixed }, // Additional configuration for the feature
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
FeatureToggleSchema.index({ companyId: 1, feature: 1 }, { unique: true });

const FeatureToggle = mongoose.model<IFeatureToggle>('FeatureToggle', FeatureToggleSchema);

export default FeatureToggle;
