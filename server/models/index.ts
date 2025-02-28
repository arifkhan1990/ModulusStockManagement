// User and authentication
export { default as User } from './user.model';

// Company and subscription
export { default as Company } from './company.model';
export { default as SubscriptionTier } from './subscription-tier.model';
export { default as CompanyPreference } from './company-preference.model';

// Feature management
export { default as Feature } from './feature.model';
export { default as FeatureToggle } from './feature-toggle.model';

// Product and inventory
export { default as Product } from './product.model';
export { default as Inventory } from './inventory.model';
export { default as Location } from './location.model';
export { default as StockMovement } from './stock-movement.model';
export { default as Supplier } from './supplier.model';

// Sales and orders
export { default as Order } from './order.model';
export { default as Payment } from './payment.model';
export { default as Customer } from './customer.model';
export { default as Invoice } from './invoice.model';
export { default as InvoiceTemplate } from './invoice-template.model';

// Content management
export { default as Page } from './page.model';

// Support and communication
export { default as SupportTicket } from './support-ticket.model';
export { default as Notification } from './notification.model';
export { default as NotificationPreference } from './notification-preference.model';

// Sharing and integrations
export { default as Sharing } from './sharing.model';
export { default as Integration } from './integration.model';

// System and analytics
export { default as SystemLog } from './system-log.model';
export { default as Backup } from './backup.model';
export { default as Analytics } from './analytics.model';
export { default as AuditLog } from './audit-log.model';
export { default as Role } from './role.model';
export { default as Download } from './download.model';

//stock-movement.model.ts
import { Schema, model } from 'mongoose';


const stockMovementSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, //optional user who made the movement
  notes: { type: String }
});


export default model('StockMovement', stockMovementSchema);