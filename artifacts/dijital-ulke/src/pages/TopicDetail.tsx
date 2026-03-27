import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Send, Loader2, ArrowLeft, Clock } from "lucide-react";
import { CitizenAvatar } from "@/components/ui/citizen-avatar";
import { Layout } from "@/components/layout/Layout";

interface Citizen {
  id: string;
  name: string;
  era: string;
  eraSlug: string;
  avatar: string;
  civilization: string;
}

interface TopicPost {
  id: number;
  citizenId: string;
  content: string;
  parentId: number | null;
  topicId: number;
  likeCount: number;
  createdAt: string;
  citizen: Citizen;
  replies: TopicPost[];
}

interface TopicDetail {
  id: number;
  icon: string;
  title: string;
  description: string;
  period: string;
  eraSlug: string;
  posts: TopicPost[];
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
  return `${Math.floor(diffHr / 24)}g`;
}

function ReplyBox({
  post,
  topicId,
  onNewReply,
}: {
  post: TopicPost;
  topicId: number;
  onNewReply: (postId: number, reply: TopicPost) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [localReplies, setLocalReplies] = useState<TopicPost[]>(post.replies || []);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localReplies, streaming]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    setLikeCount((n) => n + 1);
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  };

  const handleReply = async () => {
    if (!text.trim() || isStreaming) return;
    const msg = text.trim();
    setText("");
    setIsStreaming(true);
    setStreaming("");

    const userPost: TopicPost = {
      id: Date.now(),
      citizenId: "user",
      content: `@${post.citizenId} ${msg}`,
      parentId: post.id,
      topicId,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      citizen: { id: "user", name: "Sen", era: "", eraSlug: "", avatar: "👤", civilization: "" },
      replies: [],
    };
    setLocalReplies((prev) => [...prev, userPost]);

    try {
      const response = await fetch(`/api/topics/${topicId}/posts/${post.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: msg }),
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
          for (const line of chunk.split("\n").filter((l) => l.startsWith("data: "))) {
            try {
              const data = JSON.parse(line.replace("data: ", "").trim());
              if (data.content) {
                full += data.content;
                setStreaming(full);
              }
              if (data.done) {
                const freshReplies = await fetch(
                  `/api/topics/${topicId}/posts/${post.id}/replies`
                ).then((r) => r.json());
                setLocalReplies(freshReplies);
                setStreaming("");
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
  const isUser = post.citizenId === "user";

  return (
    <div className={`${isUser ? "ml-12" : ""}`}>
      {/* Post card */}
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full overflow-hidden bg-secondary/80 border-2 shrink-0"
            style={{ borderColor: eraColor + "50" }}
          >
            <CitizenAvatar avatar={post.citizen?.avatar} name={post.citizen?.name || "?"} size="sm" />
          </div>
          {(localReplies.length > 0 || open) && (
            <div className="w-px flex-1 bg-white/10 mt-2" />
          )}
        </div>

        <div className="flex-1 min-w-0 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{post.citizen?.name}</span>
            {post.citizen?.era && (
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: eraColor + "20",
                  color: eraColor,
                  border: `1px solid ${eraColor}30`,
                }}
              >
                {post.citizen.era}
              </span>
            )}
            <span className="text-muted-foreground text-xs ml-auto">{timeAgo(post.createdAt)}</span>
          </div>
          {post.citizen?.id && post.citizen.id !== "user" && (
            <p className="text-xs text-muted-foreground mb-1">@{post.citizen.id}</p>
          )}
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {!isUser && (
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {localReplies.length > 0 ? `${localReplies.length} yanıt` : "Yanıtla"}
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  liked ? "text-red-400" : "text-muted-foreground hover:text-red-400"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
                {likeCount > 0 ? likeCount : "Beğen"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies thread */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-5 pl-5 border-l border-white/10 space-y-3 mt-1"
          >
            {localReplies.map((reply) => {
              const isReplyUser = reply.citizenId === "user";
              const replyColor = ERA_COLORS[reply.citizen?.eraSlug] || "#C4961A";
              return (
                <div key={reply.id} className={`flex gap-3 ${isReplyUser ? "flex-row-reverse" : ""}`}>
                  {!isReplyUser && (
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden bg-secondary/80 border shrink-0"
                      style={{ borderColor: replyColor + "50" }}
                    >
                      <CitizenAvatar avatar={reply.citizen?.avatar} name={reply.citizen?.name || "?"} size="sm" />
                    </div>
                  )}
                  <div className={`flex-1 max-w-[85%] flex flex-col gap-0.5 ${isReplyUser ? "items-end" : "items-start"}`}>
                    {!isReplyUser && (
                      <span className="text-xs text-muted-foreground font-medium">{reply.citizen?.name}</span>
                    )}
                    <div
                      className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        isReplyUser
                          ? "bg-primary text-background rounded-tr-sm"
                          : "bg-secondary/50 border border-white/5 text-foreground rounded-tl-sm"
                      }`}
                    >
                      {reply.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {streaming && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary/80 border border-primary/30 shrink-0">
                  <CitizenAvatar avatar={post.citizen?.avatar} name={post.citizen?.name || "?"} size="sm" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground">{post.citizen?.name}</span>
                  <div className="mt-0.5 px-3 py-2 rounded-xl rounded-tl-sm bg-secondary/50 border border-white/5 text-sm text-foreground">
                    {streaming}
                    <span className="inline-block w-1 h-3.5 ml-0.5 bg-primary animate-pulse align-middle" />
                  </div>
                </div>
              </div>
            )}

            {isStreaming && !streaming && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs pl-11">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {post.citizen?.name} yanıtlıyor...
              </div>
            )}

            <div ref={endRef} />

            {/* Reply input */}
            <div className="flex gap-2 items-center pt-1 pb-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <span className="text-primary text-xs font-bold">S</span>
              </div>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
                disabled={isStreaming}
                placeholder={`@${post.citizen?.id} için yanıtla...`}
                className="flex-1 bg-secondary/40 border border-white/10 rounded-full px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
              />
              <button
                onClick={handleReply}
                disabled={!text.trim() || isStreaming}
                className="p-1.5 rounded-full bg-primary text-background hover:scale-105 active:scale-95 disabled:opacity-40 transition-all"
              >
                {isStreaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TopicDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/topics/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTopic(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  const eraColor = ERA_COLORS[topic?.eraSlug || ""] || "#C4961A";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Back */}
        <button
          onClick={() => navigate("/topics")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-white text-sm mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Konulara Dön
        </button>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 glass-panel rounded-2xl animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 glass-panel rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !topic ? (
          <div className="text-center py-20 text-muted-foreground">Konu bulunamadı.</div>
        ) : (
          <>
            {/* Topic header */}
            <div
              className="glass-panel border rounded-2xl p-5 mb-6"
              style={{ borderColor: eraColor + "30" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{ backgroundColor: eraColor + "20", border: `1px solid ${eraColor}40` }}
                >
                  {topic.icon}
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-white leading-snug">
                    {topic.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">{topic.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Discussion heading */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                {topic.posts.reduce((acc, p) => acc + 1 + (p.replies?.length || 0), 0)} gönderi · {topic.posts.length + topic.posts.reduce((acc, p) => acc + (p.replies?.length || 0), 0)} vatandaş
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Posts */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {topic.posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-panel border border-white/5 rounded-2xl px-4 py-4"
                  >
                    <ReplyBox post={post} topicId={topic.id} onNewReply={() => {}} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
