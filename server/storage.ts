import { users, type User, type InsertUser } from "@shared/schema";
import { demoRequests, type DemoRequest, type InsertDemoRequest } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByProviderId(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  createDemoRequest(demoRequest: InsertDemoRequest): Promise<DemoRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private demoRequests: Map<number, DemoRequest>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.demoRequests = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByProviderId(provider: string, providerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.provider === provider && user.providerId === providerId,
    );
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      id,
      username: userData.username!,
      password: userData.password || null,
      email: userData.email!,
      name: userData.name!,
      provider: userData.provider || "local",
      providerId: userData.providerId || null,
    };
    this.users.set(id, user);
    return user;
  }

  async createDemoRequest(insertDemoRequest: InsertDemoRequest): Promise<DemoRequest> {
    const id = this.currentId++;
    const demoRequest: DemoRequest = { ...insertDemoRequest, id };
    this.demoRequests.set(id, demoRequest);
    return demoRequest;
  }
}

export const storage = new MemStorage();