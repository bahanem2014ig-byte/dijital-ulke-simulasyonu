import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Send, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { CitizenAvatar } from "@/components/ui/citizen-avatar";
import { Layout } from "@/components/layout/Layout";

interface Citizen {
  id: string;
  name: string;
  era: string;
  eraSlug: string;
  avatar: string;
  archetype: string;
  civilization: string;
}

interface FeedPost {
  id: number;
  citizenId: string;
  content: string;
  parentId: number | null;
  likeCount: number;
  createdAt: string;
  citizen: Citizen;
}

function timeAgo(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}sn`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}dk`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}sa`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}g`;
}

const ERA_COLORS: Record<string, string> = {
  prehistoric: "#8B6914",
  neolithic: "#6B7C4A",
  ancient: "#C4961A",
  classical: "#7C5CBF",
  medieval: "#8B3A3A",
  earlymodern: "#2A5F8B",
  industrial: "#4A4A6A",
  digital: "#1A7A6A",
};

function ReplyThread({ post, onClose }: { post: FeedPost; onClose: () => void }) {
  const [replies, setReplies] = useState<FeedPost[]>([]);
  const [userText, setUserText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/posts/${post.id}/replies`)
      .then((r) => r.json())
      .then(setReplies)
      .catch(() => {});
  }, [post.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies, streamingContent]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikeCount((n) => n + 1);
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  };

  const handleReply = async () => {
    if (!userText.trim() || isStreaming) return;
    const text = userText.trim();
    setUserText("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const response = await fetch(`/api/posts/${post.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok || !response.body) throw new Error("Hata");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let full = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const dataStr = line.replace("data: ", "").trim();
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                full += data.content;
                setStreamingContent(full);
              }
              if (data.done) {
                // Reload replies
                const freshReplies = await fetch(`/api/posts/${post.id}/replies`).then((r) => r.json());
                setReplies(freshReplies);
                setStreamingContent("");
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  const eraColor = ERA_COLORS[post.citizen?.eraSlug] || "#C4961A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-[#090f1e] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <h3 className="font-display font-bold text-white">Gönderi & Yanıtlar</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Post */}
        <div className="px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/80 border-2 shrink-0" style={{ borderColor: eraColor + "60" }}>
              <CitizenAvatar avatar={post.citizen?.avatar} name={post.citizen?.name || "?"} size="md" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{post.citizen?.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded text-white/60" style={{ backgroundColor: eraColor + "30", border: `1px solid ${eraColor}40` }}>
                  {post.citizen?.era}
                </span>
              </div>
              <p className="text-white/90 mt-2 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-4 mt-3">
                <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}>
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  {likeCount}
                </button>
                <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  {replies.length} yanıt
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {replies.map((reply) => {
            const isUser = reply.citizenId === "user";
            const replyColor = ERA_COLORS[reply.citizen?.eraSlug] || "#C4961A";
            return (
              <div key={reply.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                {!isUser && (
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary/80 border shrink-0" style={{ borderColor: replyColor + "50" }}>
                    <CitizenAvatar avatar={reply.citizen?.avatar} name={reply.citizen?.name || "?"} size="sm" />
                  </div>
                )}
                <div className={`flex-1 max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isUser && <span className="text-xs text-muted-foreground font-medium">{reply.citizen?.name}</span>}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? "bg-primary text-background rounded-tr-sm" : "bg-secondary/50 border border-white/5 text-foreground rounded-tl-sm"}`}>
                    {reply.content}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Streaming reply */}
          {streamingContent && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary/80 border border-primary/30 shrink-0">
                <CitizenAvatar avatar={post.citizen?.avatar} name={post.citizen?.name || "?"} size="sm" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground font-medium">{post.citizen?.name}</span>
                <div className="mt-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-secondary/50 border border-white/5 text-sm leading-relaxed text-foreground">
                  {streamingContent}
                  <span className="inline-block w-1 h-4 ml-0.5 bg-primary animate-pulse align-middle" />
                </div>
              </div>
            </div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              {post.citizen?.name} yanıtlıyor...
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Reply Input */}
        <div className="shrink-0 px-5 py-4 border-t border-white/10 bg-background/60 backdrop-blur">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <span className="text-primary text-sm font-bold">S</span>
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
                disabled={isStreaming}
                placeholder={`@${post.citizen?.id} için yanıtla...`}
                className="flex-1 bg-secondary/50 border border-white/10 rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
              />
              <button
                onClick={handleReply}
                disabled={!userText.trim() || isStreaming}
                className="p-2.5 rounded-full bg-primary text-background hover:scale-105 active:scale-95 disabled:opacity-40 transition-all"
              >
                {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showThread, setShowThread] = useState(false);
  const eraColor = ERA_COLORS[post.citizen?.eraSlug] || "#C4961A";

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    setLikeCount((n) => n + 1);
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 transition-colors cursor-pointer group"
        onClick={() => setShowThread(true)}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/80 border-2 transition-colors" style={{ borderColor: eraColor + "60" }}>
              <CitizenAvatar avatar={post.citizen?.avatar} name={post.citizen?.name || "?"} size="md" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-white text-sm">{post.citizen?.name}</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: eraColor + "25", color: eraColor, border: `1px solid ${eraColor}40` }}>
                {post.citizen?.era}
              </span>
              <span className="text-muted-foreground text-xs ml-auto shrink-0">{timeAgo(post.createdAt)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">@{post.citizen?.id} · {post.citizen?.civilization}</p>

            {/* Post text */}
            <p className="text-white/90 leading-relaxed text-sm whitespace-pre-wrap">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-5 mt-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowThread(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/btn"
              >
                <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                Yanıtla
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs transition-colors group/btn ${liked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
              >
                <Heart className={`w-4 h-4 group-hover/btn:scale-110 transition-transform ${liked ? "fill-current" : ""}`} />
                {likeCount > 0 ? likeCount : "Beğen"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showThread && (
          <ReplyThread post={post} onClose={() => setShowThread(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Feed() {
  const [feedData, setFeedData] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setFeedData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const eras = [
    { slug: "all", name: "Tüm Çağlar", icon: "🌍" },
    { slug: "prehistoric", name: "Prehistorik", icon: "🦴" },
    { slug: "ancient", name: "Antik", icon: "🏛️" },
    { slug: "classical", name: "Klasik", icon: "🏺" },
    { slug: "medieval", name: "Orta Çağ", icon: "⚔️" },
    { slug: "earlymodern", name: "Erken Modern", icon: "⛵" },
    { slug: "industrial", name: "Sanayi", icon: "⚙️" },
    { slug: "digital", name: "Dijital", icon: "💻" },
  ];

  const filtered = filter === "all" ? feedData : feedData.filter((p) => p.citizen?.eraSlug === filter);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold gold-gradient-text mb-1">İnsanlık Akışı</h1>
          <p className="text-muted-foreground text-sm">108 milyar vatandaşın sesi — tüm çağlardan</p>
        </div>

        {/* Era Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {eras.map((era) => (
            <button
              key={era.slug}
              onClick={() => setFilter(era.slug)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filter === era.slug
                  ? "bg-primary text-background border-primary"
                  : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white"
              }`}
            >
              <span>{era.icon}</span>
              {era.name}
            </button>
          ))}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 glass-panel rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-4">🌐</p>
            <p>Bu çağdan henüz gönderi yok.</p>
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
