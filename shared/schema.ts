import { pgTable, text, serial, timestamp, integer, decimal, boolean, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),  // Optional for OAuth users
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  provider: text("provider").notNull().default("local"),
  providerId: text("provider_id"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name").notNull(),
  companySize: text("company_size").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'warehouse' or 'store'
  address: text("address").notNull(),
  contactNumber: text("contact_number"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number"),
  address: text("address"),
  rating: decimal("rating"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  unitPrice: decimal("unit_price").notNull(),
  reorderPoint: integer("reorder_point").notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  locationId: integer("location_id").references(() => locations.id),
  quantity: integer("quantity").notNull(),
  batchNumber: text("batch_number"),
  expiryDate: timestamp("expiry_date"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  fromLocationId: integer("from_location_id").references(() => locations.id),
  toLocationId: integer("to_location_id").references(() => locations.id),
  quantity: integer("quantity").notNull(),
  type: text("type").notNull(), // 'transfer', 'receipt', 'sale', 'adjustment'
  reference: text("reference"),
  reason: text("reason"), // For adjustment: 'damage', 'return', 'correction', 'other'
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).pick({
  fullName: true,
  email: true,
  companyName: true,
  companySize: true,
  message: true,
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  name: true,
  type: true,
  address: true,
  contactNumber: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  email: true,
  contactNumber: true,
  address: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  sku: true,
  name: true,
  description: true,
  category: true,
  unitPrice: true,
  reorderPoint: true,
  supplierId: true,
});

export const insertInventorySchema = createInsertSchema(inventory).pick({
  productId: true,
  locationId: true,
  quantity: true,
  batchNumber: true,
  expiryDate: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).pick({
  productId: true,
  fromLocationId: true,
  toLocationId: true,
  quantity: true,
  type: true,
  reference: true,
  reason: true,
  createdBy: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = typeof demoRequests.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventory.$inferSelect;

export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;