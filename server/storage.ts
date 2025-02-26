import { users, type User, type InsertUser } from "@shared/schema";
import { demoRequests, type DemoRequest, type InsertDemoRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByProviderId(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;
}

export class DatabaseStorage implements IStorage {
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

  async createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest> {
    const [result] = await db
      .insert(demoRequests)
      .values(demoRequest)
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();