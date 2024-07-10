import { datetime, mysqlTable } from "drizzle-orm/mysql-core";
import { varchar } from "drizzle-orm/mysql-core";

export const userTable = mysqlTable("user", {
  id: varchar("id", {
    length: 100,
  })
    .notNull()
    .primaryKey(),
  username: varchar("username", {
    length: 200,
  })
    .notNull()
    .unique(),
  passwordHash: varchar("password_hash", {
    length: 600,
  }).notNull(),
});

export const sessionTable = mysqlTable("session", {
  id: varchar("id", {
    length: 100,
  })
    .notNull()
    .primaryKey(),
  userId: varchar("user_id", {
    length: 100,
  })
    .notNull()
    .references(() => userTable.id),
  expiresAt: datetime("expires_at").notNull(),
});

export type UserTable = typeof userTable.$inferSelect;
export type SessionTable = typeof sessionTable.$inferSelect;
