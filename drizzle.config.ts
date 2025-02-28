
import type { Config } from 'drizzle-kit';

// This is a configuration file for Drizzle ORM, but the project is using Mongoose with MongoDB.
// This configuration is provided to prevent errors when running drizzle commands.
export default {
  dialect: 'mysql', // Using MySQL as a placeholder since MongoDB is not directly supported by Drizzle
  out: './drizzle',
  schema: './shared/schema.ts',
} satisfies Config;
