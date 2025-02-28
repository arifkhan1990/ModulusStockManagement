
import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMovement extends Document {
  productId: mongoose.Types.ObjectId;
  fromLocationId: mongoose.Types.ObjectId;
  toLocationId?: mongoose.Types.ObjectId;
  quantity: number;
  type: string;
  reference?: string;
  reason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  status?: string;
}

const StockMovementSchema = new Schema<IStockMovement>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  toLocationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  reference: { type: String },
  reason: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'completed', enum: ['pending', 'completed', 'cancelled'] }
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
