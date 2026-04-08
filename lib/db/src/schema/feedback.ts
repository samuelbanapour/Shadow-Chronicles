import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  chapter: integer("chapter"),
  scene: text("scene"),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedbackTable)
  .omit({ id: true, created_at: true })
  .extend({
    rating: z.number().int().min(1).max(5),
  });

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbackTable.$inferSelect;
