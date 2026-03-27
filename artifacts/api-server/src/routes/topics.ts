import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { topics, posts } from "@workspace/db/schema";
import { eq, isNull, desc, sql } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { CITIZENS } from "../data/citizens.js";
import { SEED_TOPICS } from "../data/seed-topics.js";

const router: IRouter = Router();

// Seed topics on startup if empty
async function seedTopicsIfEmpty() {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(topics);
    if (Number(existing[0]?.count) > 0) return;

    for (const t of SEED_TOPICS) {
      const [savedTopic] = await db
        .insert(topics)
        .values({
          icon: t.icon,
          title: t.title,
          description: t.description,
          period: t.period,
          eraSlug: t.eraSlug,
        })
        .returning();

      const savedPostIds: number[] = [];

      for (const p of t.posts) {
        const parentId =
          p.parentIndex !== undefined ? savedPostIds[p.parentIndex] ?? null : null;

        const [savedPost] = await db
          .insert(posts)
          .values({
            citizenId: p.citizenId,
            content: p.content,
            topicId: savedTopic.id,
            parentId: parentId ?? undefined,
          })
          .returning();

        savedPostIds.push(savedPost.id);
      }
    }

    console.log(`Seeded ${SEED_TOPICS.length} topics`);
  } catch (err) {
    console.error("Topic seed error:", err);
  }
}

seedTopicsIfEmpty();

function attachCitizen(post: any) {
  const citizen = CITIZENS.find((c) => c.id === post.citizenId);
  const { systemPrompt: _sp, ...citizenPublic } = citizen ?? ({} as any);
  return { ...post, citizen: citizenPublic };
}

// GET /api/topics — list all topics
router.get("/", async (_req, res) => {
  try {
    const allTopics = await db.select().from(topics).orderBy(topics.id);
    res.json(allTopics);
  } catch (err) {
    res.status(500).json({ error: "Konular alınamadı" });
  }
});

// GET /api/topics/:id — topic with top-level posts
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    if (!topic) {
      res.status(404).json({ error: "Konu bulunamadı" });
      return;
    }

    const topLevelPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.topicId, id))
      .orderBy(posts.createdAt);

    const topLevelWithCitizen = topLevelPosts
      .filter((p) => !p.parentId)
      .map(attachCitizen);

    const repliesRaw = topLevelPosts.filter((p) => p.parentId !== null);

    const repliesByParent: Record<number, any[]> = {};
    for (const r of repliesRaw) {
      const key = r.parentId!;
      if (!repliesByParent[key]) repliesByParent[key] = [];
      repliesByParent[key].push(attachCitizen(r));
    }

    const postsWithReplies = topLevelWithCitizen.map((p) => ({
      ...p,
      replies: repliesByParent[p.id] || [],
    }));

    res.json({ ...topic, posts: postsWithReplies });
  } catch (err) {
    res.status(500).json({ error: "Konu detayı alınamadı" });
  }
});

// GET /api/topics/:id/posts/:postId/replies — replies for a post within topic
router.get("/:id/posts/:postId/replies", async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const replies = await db
      .select()
      .from(posts)
      .where(eq(posts.parentId, postId))
      .orderBy(posts.createdAt);
    res.json(replies.map(attachCitizen));
  } catch (err) {
    res.status(500).json({ error: "Yanıtlar alınamadı" });
  }
});

// POST /api/topics/:id/posts/:postId/reply — user replies, citizen responds (SSE)
router.post("/:id/posts/:postId/reply", async (req, res) => {
  const postId = Number(req.params.postId);
  const { content, userHandle = "Ziyaretçi" } = req.body as {
    content: string;
    userHandle?: string;
  };

  if (!content?.trim()) {
    res.status(400).json({ error: "İçerik boş olamaz" });
    return;
  }

  try {
    const [parentPost] = await db.select().from(posts).where(eq(posts.id, postId));
    if (!parentPost) {
      res.status(404).json({ error: "Gönderi bulunamadı" });
      return;
    }

    const citizen = CITIZENS.find((c) => c.id === parentPost.citizenId);
    const systemPrompt = citizen
      ? `${citizen.systemPrompt}\n\nBir sosyal medya konusunda yorum yapıyorsun. Kısa, özlü, karakterine uygun yanıt ver — maksimum 2-3 cümle. Türkçe konuş.`
      : "Sen Dijital Ülke'de bir vatandaşsın. Kısa ve karakterine uygun yanıt ver. Türkçe konuş.";

    await db.insert(posts).values({
      citizenId: "user",
      content: `@${parentPost.citizenId} ${content}`,
      parentId: postId,
      topicId: parentPost.topicId ?? undefined,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 512,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Orijinal göndering: "${parentPost.content}"\n\n${userHandle} sana şunu yazdı: "${content}"\n\nKısa, doğal ve karakterine uygun yanıt ver.`,
        },
      ],
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    if (fullResponse) {
      const [savedReply] = await db
        .insert(posts)
        .values({
          citizenId: parentPost.citizenId,
          content: fullResponse,
          parentId: postId,
          topicId: parentPost.topicId ?? undefined,
        })
        .returning();
      res.write(`data: ${JSON.stringify({ done: true, replyId: savedReply.id })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }

    res.end();
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Yanıt gönderilemedi" });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
