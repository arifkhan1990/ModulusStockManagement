import type { Config } from "drizzle-kit";
export default {
  dialect: "mongodb",
  out: "./drizzle",
  schema: "./shared/schema.ts",
} satisfies Config;
