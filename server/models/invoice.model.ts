
import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  productId: Schema.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  subtotal: number;
}

export interface IInvoice extends Document {
  companyId: Schema.Types.ObjectId;
  invoiceNumber: string;
  orderId?: Schema.Types.ObjectId;
  customerInfo: {
    customerId?: Schema.Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: IInvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  notes?: string;
  terms?: string;
  dueDate?: Date;
  issueDate: Date;
  currency: string;
  status: string; // draft, sent, paid, partially_paid, overdue, canceled
  paymentStatus: string; // unpaid, partially_paid, paid
  paymentMethod?: string;
  paymentHistory: Array<{
    amount: number;
    method: string;
    date: Date;
    reference?: string;
    notes?: string;
  }>;
  templateId?: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  invoiceNumber: { type: String, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  customerInfo: {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String }
  },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  taxTotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: { type: String },
  terms: { type: String },
  dueDate: { type: Date },
  issueDate: { type: Date, required: true, default: Date.now },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'partially_paid', 'overdue', 'canceled'], 
    default: 'draft' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'partially_paid', 'paid'], 
    default: 'unpaid' 
  },
  paymentMethod: { type: String },
  paymentHistory: [{
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reference: { type: String },
    notes: { type: String }
  }],
  templateId: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
InvoiceSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ 'customerInfo.customerId': 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ paymentStatus: 1 });
InvoiceSchema.index({ issueDate: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ orderId: 1 });

const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
