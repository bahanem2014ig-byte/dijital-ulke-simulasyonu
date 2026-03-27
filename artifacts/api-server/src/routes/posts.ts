import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { posts } from "@workspace/db/schema";
import { eq, isNull, desc, sql } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { CITIZENS } from "../data/citizens.js";
import { SEED_POSTS } from "../data/seed-posts.js";

const router: IRouter = Router();

// Seed posts on startup if empty
async function seedIfEmpty() {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(posts);
    if (Number(existing[0]?.count) === 0) {
      for (const p of SEED_POSTS) {
        await db.insert(posts).values({ citizenId: p.citizenId, content: p.content });
      }
      console.log(`Seeded ${SEED_POSTS.length} posts`);
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

seedIfEmpty();

// GET /api/posts — feed (top-level posts, newest first)
router.get("/", async (_req, res) => {
  try {
    const topLevel = await db
      .select()
      .from(posts)
      .where(isNull(posts.parentId))
      .orderBy(desc(posts.createdAt));

    // Attach citizen info
    const result = topLevel.map((p) => {
      const citizen = CITIZENS.find((c) => c.id === p.citizenId);
      const { systemPrompt: _sp, ...citizenPublic } = citizen ?? ({} as any);
      return { ...p, citizen: citizenPublic };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Feed alınamadı" });
  }
});

// GET /api/posts/:id/replies
router.get("/:id/replies", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const replies = await db
      .select()
      .from(posts)
      .where(eq(posts.parentId, id))
      .orderBy(posts.createdAt);

    const result = replies.map((p) => {
      const citizen = CITIZENS.find((c) => c.id === p.citizenId);
      const { systemPrompt: _sp, ...citizenPublic } = citizen ?? ({} as any);
      return { ...p, citizen: citizenPublic };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Yanıtlar alınamadı" });
  }
});

// GET /api/posts/:id — single post with replies
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) {
      res.status(404).json({ error: "Gönderi bulunamadı" });
      return;
    }
    const citizen = CITIZENS.find((c) => c.id === post.citizenId);
    const { systemPrompt: _sp, ...citizenPublic } = citizen ?? ({} as any);
    res.json({ ...post, citizen: citizenPublic });
  } catch (err) {
    res.status(500).json({ error: "Gönderi alınamadı" });
  }
});

// POST /api/posts/:id/like
router.post("/:id/like", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} + 1` })
      .where(eq(posts.id, id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Beğenilemedi" });
  }
});

// POST /api/posts/:id/reply — user replies, AI responds as citizen (SSE stream)
router.post("/:id/reply", async (req, res) => {
  const postId = Number(req.params.id);
  const { content, userHandle = "Ziyaretçi" } = req.body as { content: string; userHandle?: string };

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
      ? `${citizen.systemPrompt}\n\nSen şu anda bir sosyal medya platformunda (@${citizen.id}) paylaşım yapıyorsun. Kısa, özlü ve karakterine uygun yanıtlar ver. Maksimum 2-3 cümle. Türkçe konuş.`
      : `Sen Dijital Ülke platformunda bir vatandaşsın. Kısa ve karakterine uygun yanıt ver. Türkçe konuş.`;

    // Save user's reply
    await db.insert(posts).values({
      citizenId: "user",
      content: `@${parentPost.citizenId} ${content}`,
      parentId: postId,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const originalPost = parentPost.content;

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 512,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Orijinal göndering: "${originalPost}"\n\n${userHandle} sana şunu yazdı: "${content}"\n\nKısa, doğal ve karakterine uygun yanıt ver.`,
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

    // Save AI reply as a post
    if (fullResponse) {
      const [savedReply] = await db
        .insert(posts)
        .values({
          citizenId: parentPost.citizenId,
          content: fullResponse,
          parentId: postId,
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

// POST /api/posts — create new top-level post (for future use)
router.post("/", async (req, res) => {
  const { citizenId, content } = req.body as { citizenId: string; content: string };
  if (!citizenId || !content?.trim()) {
    res.status(400).json({ error: "Eksik alan" });
    return;
  }
  try {
    const [post] = await db.insert(posts).values({ citizenId, content }).returning();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Gönderi oluşturulamadı" });
  }
});

export default router;
