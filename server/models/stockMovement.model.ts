
import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMovement extends Document {
  productId: Schema.Types.ObjectId;
  fromLocationId: Schema.Types.ObjectId;
  toLocationId?: Schema.Types.ObjectId;
  quantity: number;
  type: string; // transfer, adjustment, receive, ship, return, dispose, etc.
  reference?: string; // PO number, SO number, etc.
  referenceType?: string; // PO, SO, etc.
  referenceId?: Schema.Types.ObjectId; // ID of the related document
  status: string; // pending, completed, cancelled
  reason?: string;
  batchNumber?: string;
  lotNumber?: string;
  serialNumbers?: string[];
  expiryDate?: Date;
  notes?: string;
  cost?: number;
  createdBy: Schema.Types.ObjectId;
  approvedBy?: Schema.Types.ObjectId;
  completedBy?: Schema.Types.ObjectId;
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  customFields?: {
    [key: string]: any;
  };
  createdAt: Date;
  completedAt?: Date;
}

const StockMovementSchema = new Schema<IStockMovement>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  toLocationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  quantity: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['transfer', 'adjustment', 'receive', 'ship', 'return', 'dispose', 'count', 'manufacture']
  },
  reference: { type: String },
  referenceType: { type: String },
  referenceId: { type: Schema.Types.ObjectId },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'in progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  reason: { type: String },
  batchNumber: { type: String },
  lotNumber: { type: String },
  serialNumbers: [{ type: String }],
  expiryDate: { type: Date },
  notes: { type: String },
  cost: { type: Number },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  customFields: { type: Map, of: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

// Indexes for faster lookups
StockMovementSchema.index({ productId: 1 });
StockMovementSchema.index({ fromLocationId: 1 });
StockMovementSchema.index({ toLocationId: 1 });
StockMovementSchema.index({ createdAt: 1 });
StockMovementSchema.index({ status: 1 });
StockMovementSchema.index({ type: 1 });

const StockMovement = mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);

export default StockMovement;
