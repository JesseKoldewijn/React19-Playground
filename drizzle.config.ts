import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql", // "postgresql" | "mysql" | "sqlite"
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  schema: ["./src/server/schema.ts"],
});
