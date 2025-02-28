
import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: Schema.Types.ObjectId;
  orderNumber: string;
  amount: number;
  paymentMethod: string; // 'cash', 'bank_transfer', 'bkash', 'stripe', etc.
  paymentGateway?: string;
  transactionId?: string;
  status: string; // 'pending', 'completed', 'failed', 'refunded'
  paymentDate: Date;
  notes?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>; // For storing gateway-specific data
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    orderNumber: {
      type: String,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cash', 'bank_transfer', 'bkash', 'nagad', 'stripe', 'credit_card', 'other']
    },
    paymentGateway: {
      type: String
    },
    transactionId: {
      type: String
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String
    },
    receiptUrl: {
      type: String
    },
    metadata: {
      type: Schema.Types.Mixed
    },
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
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster lookups
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentMethod: 1 });
PaymentSchema.index({ paymentDate: 1 });
PaymentSchema.index({ createdAt: 1 });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  companyId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  orderNumber: string;
  amount: number;
  paymentMethod: string; // 'cash', 'bank_transfer', 'bkash', 'stripe', etc.
  paymentGateway?: string;
  transactionId?: string;
  status: string; // 'pending', 'completed', 'failed', 'refunded'
  paymentDate: Date;
  notes?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>; // For storing gateway-specific data
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  companyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  orderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  orderNumber: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  paymentGateway: { 
    type: String 
  },
  transactionId: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    required: true 
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  notes: { 
    type: String 
  },
  receiptUrl: { 
    type: String 
  },
  metadata: { 
    type: Schema.Types.Mixed 
  },
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
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for faster lookups
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ orderNumber: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentDate: 1 });
PaymentSchema.index({ companyId: 1 }); // For tenant isolation

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
