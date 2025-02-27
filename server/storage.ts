import { 
  users, type User, type InsertUser,
  demoRequests, type DemoRequest, type InsertDemoRequest,
  locations, type Location, type InsertLocation,
  suppliers, type Supplier, type InsertSupplier,
  products, type Product, type InsertProduct,
  inventory, type Inventory, type InsertInventory,
  stockMovements, type StockMovement, type InsertStockMovement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByProviderId(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;

  // Demo requests
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;

  // Location management
  getLocation(id: number): Promise<Location | undefined>;
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<Location>): Promise<Location>;

  // Supplier management
  getSupplier(id: number): Promise<Supplier | undefined>;
  getSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<Supplier>): Promise<Supplier>;

  // Product management
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;

  // Inventory management
  getInventory(productId: number, locationId: number): Promise<Inventory | undefined>;
  getInventoryByLocation(locationId: number): Promise<Inventory[]>;
  updateInventory(id: number, inventory: Partial<Inventory>): Promise<Inventory>;

  // Stock movement
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  getStockMovements(productId: number): Promise<StockMovement[]>;
}

export class DatabaseStorage implements IStorage {
  // Existing user methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByProviderId(provider: string, providerId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.provider, provider))
      .where(eq(users.providerId, providerId));
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username!,
        password: userData.password || null,
        email: userData.email!,
        name: userData.name!,
        provider: userData.provider || "local",
        providerId: userData.providerId || null,
      })
      .returning();
    return user;
  }

  // Demo request method
  async createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest> {
    const [result] = await db
      .insert(demoRequests)
      .values(demoRequest)
      .returning();
    return result;
  }

  // Location methods
  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.isActive, true));
  }

  async createLocation(locationData: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(locationData).returning();
    return location;
  }

  async updateLocation(id: number, locationData: Partial<Location>): Promise<Location> {
    const [location] = await db
      .update(locations)
      .set({ ...locationData, updatedAt: new Date() })
      .where(eq(locations.id, id))
      .returning();
    return location;
  }

  // Supplier methods
  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.isActive, true));
  }

  async createSupplier(supplierData: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(supplierData).returning();
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    const [supplier] = await db
      .update(suppliers)
      .set({ ...supplierData, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return supplier;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Inventory methods
  async getInventory(productId: number, locationId: number): Promise<Inventory | undefined> {
    const [inv] = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.productId, productId),
          eq(inventory.locationId, locationId)
        )
      );
    return inv;
  }

  async getInventoryByLocation(locationId: number): Promise<Inventory[]> {
    return await db
      .select()
      .from(inventory)
      .where(eq(inventory.locationId, locationId));
  }

  async updateInventory(id: number, inventoryData: Partial<Inventory>): Promise<Inventory> {
    const [inv] = await db
      .update(inventory)
      .set({ ...inventoryData, lastUpdated: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return inv;
  }

  // Stock movement methods
  async createStockMovement(movementData: InsertStockMovement): Promise<StockMovement> {
    const [movement] = await db
      .insert(stockMovements)
      .values(movementData)
      .returning();
    return movement;
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId))
      .orderBy(desc(stockMovements.createdAt));
  }
}

export const storage = new DatabaseStorage();