import { Router, type IRouter } from "express";
import { db, feedbackTable, insertFeedbackSchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SubmitFeedbackBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/feedback", async (req, res) => {
  const parsed = SubmitFeedbackBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const validated = insertFeedbackSchema.safeParse(parsed.data);
  if (!validated.success) {
    res.status(400).json({ error: "Invalid feedback data" });
    return;
  }

  const [row] = await db.insert(feedbackTable).values(validated.data).returning({ id: feedbackTable.id });
  res.status(201).json({ id: row.id, message: "Feedback saved. Thank you!" });
});

router.get("/feedback", async (_req, res) => {
  const items = await db.select().from(feedbackTable).orderBy(desc(feedbackTable.createdAt));
  res.json(items);
});

export default router;
