import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  citizenId: text("citizen_id").notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id"),
  topicId: integer("topic_id"),
  likeCount: integer("like_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
