
import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseOrderItem {
  productId: Schema.Types.ObjectId;
  sku: string;
  name: string;
  quantity: number;
  receivedQuantity?: number;
  unitPrice: number;
  expectedUnitPrice?: number;
  discount?: number;
  taxRate?: number;
  taxAmount?: number;
  subTotal: number;
  total: number;
  status?: string;
  notes?: string;
}

export interface IPurchaseOrder extends Document {
  poNumber: string;
  supplierId: Schema.Types.ObjectId;
  supplierName: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;
  status: string;
  paymentStatus: string;
  paymentTerms?: string;
  paymentDueDate?: Date;
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
  items: IPurchaseOrderItem[];
  notes?: string;
  attachments?: string[];
  locationId: Schema.Types.ObjectId;
  currency?: string;
  exchangeRate?: number;
  tags?: string[];
  businessSize: string; // small, medium, large
  businessType?: string; // retail, manufacturing, distribution, etc.
  createdBy: Schema.Types.ObjectId;
  approvedBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderItemSchema = new Schema<IPurchaseOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  receivedQuantity: { type: Number, default: 0 },
  unitPrice: { type: Number, required: true },
  expectedUnitPrice: { type: Number },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  subTotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'partially received', 'received', 'rejected'],
    default: 'pending'
  },
  notes: { type: String }
});

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  poNumber: { type: String, required: true, unique: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierName: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date },
  deliveryDate: { type: Date },
  status: { 
    type: String, 
    required: true,
    enum: ['draft', 'pending', 'approved', 'ordered', 'received', 'partially received', 'cancelled'],
    default: 'draft'
  },
  paymentStatus: { 
    type: String, 
    required: true,
    enum: ['unpaid', 'partially paid', 'paid', 'overdue'],
    default: 'unpaid'
  },
  paymentTerms: { type: String },
  paymentDueDate: { type: Date },
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
  items: [PurchaseOrderItemSchema],
  notes: { type: String },
  attachments: [{ type: String }],
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  currency: { type: String, default: 'USD' },
  exchangeRate: { type: Number, default: 1 },
  tags: [{ type: String }],
  businessSize: { type: String, enum: ['small', 'medium', 'large'], default: 'small' },
  businessType: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate PO number automatically
PurchaseOrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    this.poNumber = `PO-${year}${month}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

// Indexes for faster lookups
// Note: poNumber field index is already defined in the schema
PurchaseOrderSchema.index({ supplierId: 1 });
PurchaseOrderSchema.index({ status: 1 });
PurchaseOrderSchema.index({ orderDate: 1 });
PurchaseOrderSchema.index({ locationId: 1 });

const PurchaseOrder = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);

export default PurchaseOrder;
