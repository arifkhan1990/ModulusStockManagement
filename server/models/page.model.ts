
import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  companyId: Schema.Types.ObjectId;
  type: 'about' | 'terms' | 'privacy' | 'custom';
  title: string;
  content: string;
  slug: string;
  isPublished: boolean;
  customFields?: Record<string, any>;
  metaDescription?: string;
  metaKeywords?: string[];
  versions?: {
    content: string;
    updatedAt: Date;
    updatedBy: Schema.Types.ObjectId;
  }[];
  isDefault: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  type: { type: String, required: true, enum: ['about', 'terms', 'privacy', 'custom'] },
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  customFields: { type: Map, of: Schema.Types.Mixed },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  versions: [{
    content: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  isDefault: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
PageSchema.index({ companyId: 1, type: 1 });
PageSchema.index({ companyId: 1, slug: 1 }, { unique: true });
PageSchema.index({ companyId: 1, isPublished: 1 });

const Page = mongoose.model<IPage>('Page', PageSchema);

export default Page;
