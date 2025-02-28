import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  taxRate: number;
  discount: number;
  locationId: Schema.Types.ObjectId;
}

export interface IOrder extends Document {
  companyId: Schema.Types.ObjectId;
  orderNumber: string;
  customerId?: Schema.Types.ObjectId;
  customerName?: string;
  items: IOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  paymentMethod?: string;
  paymentReference?: string;
  shippingMethod?: string;
  shippingCost: number;
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
  notes?: string;
  salesChannelId?: Schema.Types.ObjectId;
  salesRepId?: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  currency: string;
  exchangeRate: number;
  tags?: string[];
  businessSize: string;
  businessType?: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  orderDate: Date;
  requiredDate?: Date;
  shippedDate?: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer' 
  },
  customerName: { 
    type: String 
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      sku: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        required: true
      },
      taxAmount: {
        type: Number,
        default: 0
      },
      taxRate: {
        type: Number,
        default: 0
      },
      discount: {
        type: Number,
        default: 0
      },
      locationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  paymentReference: {
    type: String
  },
  shippingMethod: {
    type: String
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  trackingNumber: {
    type: String
  },
  carrier: {
    type: String
  },
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
  notes: {
    type: String
  },
  salesChannelId: {
    type: Schema.Types.ObjectId,
    ref: 'SalesChannel'
  },
  salesRepId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  exchangeRate: {
    type: Number,
    default: 1
  },
  tags: [{ 
    type: String 
  }],
  businessSize: { 
    type: String, 
    enum: ['small', 'medium', 'large'], 
    default: 'small' 
  },
  businessType: { 
    type: String 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  requiredDate: { 
    type: Date 
  },
  shippedDate: { 
    type: Date 
  },
  deliveryDate: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
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
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderDate: 1 });
OrderSchema.index({ locationId: 1 });
OrderSchema.index({ companyId: 1 }); // For tenant isolation

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;