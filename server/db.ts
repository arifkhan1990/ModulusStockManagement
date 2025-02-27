import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import config from "./config";

neonConfig.webSocketConstructor = ws;

if (!config.database.url) {
  throw new Error("DATABASE_URL env var is not set");
}

const sql = neon(config.database.url);
export const db = drizzle(sql, { schema });