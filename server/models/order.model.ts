
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  taxAmount?: number;
  subTotal: number;
  total: number;
  notes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId?: Schema.Types.ObjectId;
  customerName?: string;
  orderDate: Date;
  requiredDate?: Date;
  shippedDate?: Date;
  deliveryDate?: Date;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentReference?: string;
  shippingMethod?: string;
  shippingCost?: number;
  trackingNumber?: string;
  carrier?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subTotal: number;
  taxAmount: number;
  discount?: number;
  total: number;
  items: IOrderItem[];
  notes?: string;
  locationId: Schema.Types.ObjectId;
  salesChannelId?: Schema.Types.ObjectId;
  salesRepId?: Schema.Types.ObjectId;
  currency?: string;
  exchangeRate?: number;
  tags?: string[];
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  subTotal: { type: Number, required: true },
  total: { type: Number, required: true },
  notes: { type: String }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String },
  orderDate: { type: Date, default: Date.now },
  requiredDate: { type: Date },
  shippedDate: { type: Date },
  deliveryDate: { type: Date },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    required: true,
    enum: ['pending', 'partially paid', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: { type: String },
  paymentReference: { type: String },
  shippingMethod: { type: String },
  shippingCost: { type: Number, default: 0 },
  trackingNumber: { type: String },
  carrier: { type: String },
  billingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  subTotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  items: [OrderItemSchema],
  notes: { type: String },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  salesChannelId: { type: Schema.Types.ObjectId, ref: 'SalesChannel' },
  salesRepId: { type: Schema.Types.ObjectId, ref: 'User' },
  currency: { type: String, default: 'USD' },
  exchangeRate: { type: Number, default: 1 },
  tags: [{ type: String }],
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate order number automatically
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    this.orderNumber = `ORD-${year}${month}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

// Indexes for faster lookups
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: 1 });
OrderSchema.index({ locationId: 1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
