import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";
import { CITIZENS } from "../data/citizens";

const router: IRouter = Router();

router.get("/conversations", async (_req, res) => {
  try {
    const all = await db.select().from(conversations).orderBy(conversations.createdAt);
    res.json(all);
  } catch (_err) {
    res.status(500).json({ error: "Konuşmalar alınamadı" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    const [conv] = await db
      .insert(conversations)
      .values({ title: body.title })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    res.status(400).json({ error: "Konuşma oluşturulamadı" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    if (!conv) {
      res.status(404).json({ error: "Bulunamadı" });
      return;
    }
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);
    res.json({ ...conv, messages: msgs });
  } catch (err) {
    res.status(500).json({ error: "Konuşma alınamadı" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(messages).where(eq(messages.conversationId, id));
    const deleted = await db
      .delete(conversations)
      .where(eq(conversations.id, id))
      .returning();
    if (!deleted.length) {
      res.status(404).json({ error: "Bulunamadı" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Silinemedi" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: "Mesajlar alınamadı" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  const convId = Number(req.params.id);

  try {
    const body = SendOpenaiMessageBody.parse(req.body);
    const citizenId = body.citizenId as string | undefined;

    const citizen = citizenId
      ? CITIZENS.find((c) => c.id === citizenId)
      : undefined;

    // Geçmiş mesajları al
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(messages.createdAt);

    // Kullanıcı mesajını kaydet
    await db.insert(messages).values({
      conversationId: convId,
      role: "user",
      content: body.content,
    });

    // System prompt oluştur
    const systemPrompt = citizen
      ? citizen.systemPrompt
      : `Sen Dijital Ülke'nin bir vatandaşısın. Tüm insanlık tarihini, tüm medeniyetleri, tüm çağları temsil eden bu dijital ülkede yaşıyorsun. Türkçe konuş.`;

    const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: body.content },
    ];

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Asistan cevabını kaydet
    await db.insert(messages).values({
      conversationId: convId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Mesaj gönderilemedi" });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
