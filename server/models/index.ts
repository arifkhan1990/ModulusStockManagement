import mongoose from "mongoose";
import User from "./user.model";
import DemoRequest from "./demo-request.model";
import Location from "./location.model";
import Supplier from "./supplier.model";
import Product from "./product.model";
import Inventory from "./inventory.model";
import StockMovement from "./stock-movement.model";
import Category from "./category.model";
import Customer from "./customer.model";
import Order from "./order.model";
import Warehouse from "./warehouse.model";
import PurchaseOrder from "./purchase-order.model";
import SalesChannel from "./sales-channel.model";
import Report from "./report.model";
import Alert from "./alert.model";
import Payment from "./payment.model";
import Company from "./company.model";
import SubscriptionTier from "./subscription-tier.model";
import CompanyPreference from "./company-preference.model";
import Feature from "./feature.model";
import FeatureToggle from "./feature-toggle.model";
import Invoice from "./invoice.model";
import InvoiceTemplate from "./invoice-template.model";
import Page from "./page.model";
import SupportTicket from "./support-ticket.model";
import Notification from "./notification.model";
import NotificationPreference from "./notification-preference.model";
import Sharing from "./sharing.model";
import Integration from "./integration.model";
import SystemLog from "./system-log.model";
import Backup from "./backup.model";
import Analytics from "./analytics.model";
import AuditLog from "./audit-log.model";
import Role from "./role.model";
import Download from "./download.model";

export {
  User,
  DemoRequest,
  Location,
  Supplier,
  Product,
  Inventory,
  StockMovement,
  Category,
  Customer,
  Order,
  Warehouse,
  PurchaseOrder,
  SalesChannel,
  Report,
  Alert,
  Payment,
  Company,
  SubscriptionTier,
  CompanyPreference,
  Feature,
  FeatureToggle,
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
  Download,
};

export default mongoose;
