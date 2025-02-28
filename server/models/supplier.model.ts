
import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  email: string;
  contactNumber?: string;
  alternateContact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  rating?: number;
  paymentTerms?: string;
  leadTime?: number; // in days
  minimumOrderQuantity?: number;
  preferredCurrency?: string;
  taxId?: string;
  notes?: string;
  tags?: string[];
  businessSize: string; // small, medium, large
  supplierType?: string; // manufacturer, distributor, wholesaler
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String },
  alternateContact: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  website: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  paymentTerms: { type: String },
  leadTime: { type: Number },
  minimumOrderQuantity: { type: Number },
  preferredCurrency: { type: String },
  taxId: { type: String },
  notes: { type: String },
  tags: [{ type: String }],
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  supplierType: { type: String, enum: ['manufacturer', 'distributor', 'wholesaler', 'other'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);

export default Supplier;
