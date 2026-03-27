import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  icon: text("icon").notNull().default("🌍"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  period: text("period").notNull(),
  eraSlug: text("era_slug").notNull().default("classical"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = typeof topics.$inferInsert;
