import { Router, type IRouter } from "express";
import { db, feedbackTable, insertFeedbackSchema } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/feedback", async (req, res) => {
  const parsed = insertFeedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [item] = await db.insert(feedbackTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.get("/feedback", async (_req, res) => {
  const items = await db.select().from(feedbackTable).orderBy(desc(feedbackTable.created_at));
  res.json(items);
});

export default router;
