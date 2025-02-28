
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
import mongoose, { Schema, Document } from "mongoose";

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
  items: IOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentStatus: string; // pending, paid, partially_paid, refunded
  paymentMethod: string; // cash, card, online
  paymentDetails?: {
    transactionId?: string;
    cardType?: string;
    lastFourDigits?: string;
    receiptUrl?: string;
  };
  notes?: string;
  status: string; // draft, processing, completed, cancelled
  createdBy: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  refundedAmount?: number;
  source: string; // pos, online, marketplace
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
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
      enum: ['pending', 'paid', 'partially_paid', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online', 'other'],
      required: true
    },
    paymentDetails: {
      transactionId: String,
      cardType: String,
      lastFourDigits: String,
      receiptUrl: String
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ['draft', 'processing', 'completed', 'cancelled'],
      default: 'draft'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    refundedAmount: {
      type: Number,
      default: 0
    },
    source: {
      type: String,
      enum: ['pos', 'online', 'marketplace'],
      default: 'pos'
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

// Indexes for queries
OrderSchema.index({ companyId: 1, orderNumber: 1 });
OrderSchema.index({ companyId: 1, customerId: 1 });
OrderSchema.index({ companyId: 1, createdAt: -1 });
OrderSchema.index({ companyId: 1, status: 1 });
OrderSchema.index({ companyId: 1, paymentStatus: 1 });
OrderSchema.index({ companyId: 1, source: 1 });
OrderSchema.index({ companyId: 1, locationId: 1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
