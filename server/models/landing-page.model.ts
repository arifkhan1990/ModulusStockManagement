
import mongoose, { Schema, Document } from "mongoose";

export interface ILandingPage extends Document {
  companyId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  status: string; // draft, published, archived
  template: string;
  sections: {
    type: string; // header, hero, features, testimonials, contact, etc.
    title?: string;
    subtitle?: string;
    content?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    order: number;
    settings?: Map<string, any>;
  }[];
  customCss?: string;
  externalUrl?: string; // For integration with existing website
  googleAnalyticsId?: string;
  customDomain?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageSchema = new Schema<ILandingPage>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    metaDescription: {
      type: String
    },
    metaKeywords: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    template: {
      type: String,
      required: true,
      default: 'default'
    },
    sections: [
      {
        type: {
          type: String,
          required: true
        },
        title: String,
        subtitle: String,
        content: String,
        imageUrl: String,
        buttonText: String,
        buttonUrl: String,
        order: {
          type: Number,
          required: true
        },
        settings: {
          type: Map,
          of: Schema.Types.Mixed
        }
      }
    ],
    customCss: String,
    externalUrl: String,
    googleAnalyticsId: String,
    customDomain: String,
    isDefault: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes
LandingPageSchema.index({ companyId: 1, status: 1 });
LandingPageSchema.index({ companyId: 1, isDefault: 1 });
LandingPageSchema.index({ customDomain: 1 }, { sparse: true });

const LandingPage = mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);

export default LandingPage;
