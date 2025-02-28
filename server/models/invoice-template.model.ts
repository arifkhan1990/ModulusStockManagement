
import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceTemplate extends Document {
  companyId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  content: object; // JSON object containing template structure
  isDefault: boolean;
  logoPosition?: string;
  headerSettings?: object;
  footerSettings?: object;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    text?: string;
  };
  fontFamily?: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceTemplateSchema = new Schema<IInvoiceTemplate>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  description: { type: String },
  content: { type: Schema.Types.Mixed, required: true },
  isDefault: { type: Boolean, default: false },
  logoPosition: { type: String, default: 'top-left' },
  headerSettings: { type: Schema.Types.Mixed },
  footerSettings: { type: Schema.Types.Mixed },
  colorScheme: {
    primary: { type: String },
    secondary: { type: String },
    accent: { type: String },
    text: { type: String }
  },
  fontFamily: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
InvoiceTemplateSchema.index({ companyId: 1, name: 1 }, { unique: true });
InvoiceTemplateSchema.index({ companyId: 1, isDefault: 1 });

const InvoiceTemplate = mongoose.model<IInvoiceTemplate>('InvoiceTemplate', InvoiceTemplateSchema);

export default InvoiceTemplate;
