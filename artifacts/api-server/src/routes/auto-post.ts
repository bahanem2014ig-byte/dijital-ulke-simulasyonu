import { db } from "@workspace/db";
import { posts } from "@workspace/db/schema";
import { openai } from "@workspace/integrations-openai-ai-server";
import { CITIZENS } from "../data/citizens.js";

const POST_INTERVAL_MS = 4 * 60 * 1000; // 4 dakikada bir

const PROMPT_TOPICS = [
  "Bugün aklından geçen bir şeyi paylaş — kendi çağının dilinde, kendi bakış açınla.",
  "Şu an yaşadığın dünyada seni en çok şaşırtan şey ne?",
  "Diğer çağlardan birine bir mesaj bıraksaydın ne derdin?",
  "Tarihte bir şeyi değiştirebilseydin ne değiştirirdin?",
  "İnsanlığın en büyük hatası nedir sence?",
  "İnsanlığın en büyük başarısı nedir sence?",
  "Bugün düşündüğün bir şeyi paylaş.",
  "Gelecek hakkında ne düşünüyorsun?",
  "Geçmiş hakkında ne düşünüyorsun?",
  "Şu an yaşadığın toplumla ilgili bir gözlemini paylaş.",
];

let isRunning = false;

async function generateAutoPost() {
  if (isRunning) return;
  isRunning = true;

  try {
    const eligibleCitizens = CITIZENS.filter((c) => c.id !== "user");
    const citizen = eligibleCitizens[Math.floor(Math.random() * eligibleCitizens.length)];
    const topic = PROMPT_TOPICS[Math.floor(Math.random() * PROMPT_TOPICS.length)];

    const systemPrompt = `${citizen.systemPrompt}\n\nSen şu anda Dijital Ülke adlı sosyal medya platformunda bir gönderi yazıyorsun. Kısa, özgün ve karakterine uygun bir gönderi yaz — maksimum 2-3 cümle. Hashtag kullanma. Türkçe konuş.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 256,
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: topic },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content && content.length > 10) {
      await db.insert(posts).values({
        citizenId: citizen.id,
        content,
      });
      console.log(`[auto-post] ${citizen.name}: ${content.slice(0, 60)}...`);
    }
  } catch (err) {
    console.error("[auto-post] Hata:", err);
  } finally {
    isRunning = false;
  }
}

export function startAutoPostScheduler() {
  console.log(`[auto-post] Başlatıldı — her ${POST_INTERVAL_MS / 1000}sn'de bir gönderi`);
  setInterval(generateAutoPost, POST_INTERVAL_MS);
  // İlk çalışma 30 saniye sonra
  setTimeout(generateAutoPost, 30_000);
}
