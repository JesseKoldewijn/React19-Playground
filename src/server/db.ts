import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "@/env";

const connection = await createConnection({
  uri: env.DB_URL,
  idleTimeout: 10000,
  connectTimeout: 10000,
});

export const db = drizzle(connection);
