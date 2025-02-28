import mongoose from 'mongoose';
import User from './user.model';
import Location from './location.model';
import Supplier from './supplier.model';
import Product from './product.model';
import Inventory from './inventory.model';
import StockMovement from './stock-movement.model';
import DemoRequest from './demoRequest.model';
import Company from './company.model';
import SubscriptionTier from './subscription-tier.model';
import CompanyPreference from './company-preference.model';
import Feature from './feature.model';
import FeatureToggle from './feature-toggle.model';
import Order from './order.model';
import Payment from './payment.model';
import Customer from './customer.model';
import Invoice from './invoice.model';
import InvoiceTemplate from './invoice-template.model';
import Page from './page.model';
import SupportTicket from './support-ticket.model';
import Notification from './notification.model';
import NotificationPreference from './notification-preference.model';
import Sharing from './sharing.model';
import Integration from './integration.model';
import SystemLog from './system-log.model';
import Backup from './backup.model';
import Analytics from './analytics.model';
import AuditLog from './audit-log.model';
import Role from './role.model';
import Download from './download.model';


export {
  User,
  Location,
  Supplier,
  Product,
  Inventory,
  StockMovement,
  DemoRequest,
  Company,
  SubscriptionTier,
  CompanyPreference,
  Feature,
  FeatureToggle,
  Order,
  Payment,
  Customer,
  Invoice,
  InvoiceTemplate,
  Page,
  SupportTicket,
  Notification,
  NotificationPreference,
  Sharing,
  Integration,
  SystemLog,
  Backup,
  Analytics,
  AuditLog,
  Role,
  Download
};

export default mongoose;