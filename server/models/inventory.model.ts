
import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  productId: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  quantity: number;
  availableQuantity?: number;
  reservedQuantity?: number;
  inTransitQuantity?: number;
  batchNumber?: string;
  lotNumber?: string;
  serialNumbers?: string[];
  expiryDate?: Date;
  manufactureDate?: Date;
  receivedDate?: Date;
  cost?: number;
  stockStatus?: string; // in stock, low stock, out of stock
  lastStockTakeDate?: Date;
  stockTakeNotes?: string;
  shelf?: string;
  aisle?: string;
  bin?: string;
  zone?: string;
  section?: string;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  qcStatus?: string; // passed, failed, pending
  quarantined?: boolean;
  quarantineReason?: string;
  customFields?: {
    [key: string]: any;
  };
  lastUpdated: Date;
}

const InventorySchema = new Schema<IInventory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  availableQuantity: { type: Number },
  reservedQuantity: { type: Number, default: 0 },
  inTransitQuantity: { type: Number, default: 0 },
  batchNumber: { type: String },
  lotNumber: { type: String },
  serialNumbers: [{ type: String }],
  expiryDate: { type: Date },
  manufactureDate: { type: Date },
  receivedDate: { type: Date },
  cost: { type: Number },
  stockStatus: { 
    type: String, 
    enum: ['in stock', 'low stock', 'out of stock'],
    default: 'in stock'
  },
  lastStockTakeDate: { type: Date },
  stockTakeNotes: { type: String },
  shelf: { type: String },
  aisle: { type: String },
  bin: { type: String },
  zone: { type: String },
  section: { type: String },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  qcStatus: { 
    type: String, 
    enum: ['passed', 'failed', 'pending', 'not required'],
    default: 'not required'
  },
  quarantined: { type: Boolean, default: false },
  quarantineReason: { type: String },
  customFields: { type: Map, of: Schema.Types.Mixed },
  lastUpdated: { type: Date, default: Date.now },
});

// Compound index for faster lookups
InventorySchema.index({ productId: 1, locationId: 1 }, { unique: true });
InventorySchema.index({ expiryDate: 1 });
InventorySchema.index({ stockStatus: 1 });

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);

export default Inventory;
