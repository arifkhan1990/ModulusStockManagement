
import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  manager?: string;
  managerId?: Schema.Types.ObjectId;
  capacity?: number;
  capacityUnit?: string;
  usage?: number;
  usagePercent?: number;
  zones?: {
    id: string;
    name: string;
    type: string;
    capacity: number;
  }[];
  capabilities?: string[];
  operatingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude?: number;
  longitude?: number;
  notes?: string;
  parentWarehouseId?: Schema.Types.ObjectId;
  isActive: boolean;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema = new Schema<IWarehouse>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  phone: { type: String },
  email: { type: String },
  manager: { type: String },
  managerId: { type: Schema.Types.ObjectId, ref: 'User' },
  capacity: { type: Number },
  capacityUnit: { type: String, enum: ['sqft', 'sqm', 'pallets', 'items'] },
  usage: { type: Number, default: 0 },
  usagePercent: { type: Number, default: 0 },
  zones: [{
    id: { type: String },
    name: { type: String },
    type: { type: String },
    capacity: { type: Number }
  }],
  capabilities: [{ type: String }],
  operatingHours: {
    monday: { type: String, default: '9:00-17:00' },
    tuesday: { type: String, default: '9:00-17:00' },
    wednesday: { type: String, default: '9:00-17:00' },
    thursday: { type: String, default: '9:00-17:00' },
    friday: { type: String, default: '9:00-17:00' },
    saturday: { type: String, default: 'Closed' },
    sunday: { type: String, default: 'Closed' }
  },
  latitude: { type: Number },
  longitude: { type: Number },
  notes: { type: String },
  parentWarehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  isActive: { type: Boolean, default: true },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for faster lookups
// Note: code field index is likely already defined in the schema definition
WarehouseSchema.index({ name: 1 });
WarehouseSchema.index({ 'address.country': 1, 'address.city': 1 });

const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);

export default Warehouse;
