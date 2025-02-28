import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  companyId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  minimumStockLevel: number;
  maximumStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastRestockDate?: Date;
  incomingStock?: number;
  costPerUnit?: number;
  notes?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true, default: 0 },
  availableQuantity: { type: Number, required: true, default: 0 },
  reservedQuantity: { type: Number, required: true, default: 0 },
  minimumStockLevel: { type: Number, default: 0 },
  maximumStockLevel: { type: Number, default: 0 },
  reorderPoint: { type: Number, default: 0 },
  reorderQuantity: { type: Number, default: 0 },
  lastRestockDate: { type: Date },
  incomingStock: { type: Number, default: 0 },
  costPerUnit: { type: Number },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['in_stock', 'low_stock', 'out_of_stock'], 
    default: 'in_stock' 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for fast lookups of inventory by product and location
InventorySchema.index({ productId: 1, locationId: 1 }, { unique: true });
InventorySchema.index({ companyId: 1 }); // For tenant isolation
InventorySchema.index({ locationId: 1 }); // For location-based queries
InventorySchema.index({ status: 1 }); // For status-based queries

// Pre-save hook to update status based on quantity and reorderPoint
InventorySchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.status = 'out_of_stock';
  } else if (this.quantity <= this.reorderPoint) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }

  // Ensure available quantity is never negative
  this.availableQuantity = Math.max(0, this.quantity - this.reservedQuantity);

  this.updatedAt = new Date();
  next();
});

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);

export default Inventory;