import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Globe, Users, MessageSquare, BookOpen, Zap, TrendingUp } from "lucide-react";

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

const ERA_DATA = [
  { slug: "prehistoric", name: "Prehistorik", icon: "🦴", share: 8 },
  { slug: "neolithic", name: "Neolitik", icon: "🌾", share: 12 },
  { slug: "ancient", name: "Antik", icon: "🏛️", share: 18 },
  { slug: "classical", name: "Klasik", icon: "🏺", share: 15 },
  { slug: "medieval", name: "Orta Çağ", icon: "⚔️", share: 20 },
  { slug: "earlymodern", name: "Erken Modern", icon: "⛵", share: 12 },
  { slug: "industrial", name: "Sanayi", icon: "⚙️", share: 8 },
  { slug: "digital", name: "Dijital", icon: "💻", share: 7 },
];

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display.toLocaleString("tr-TR")}</>;
}

interface Post {
  id: number;
  citizenId: string;
  content: string;
  createdAt: string;
  citizen: {
    name: string;
    avatar: string;
    era: string;
    eraSlug: string;
  };
}

interface Citizen {
  id: string;
  name: string;
  avatar: string;
  era: string;
  eraSlug: string;
  archetype: string;
}

export default function Nexus() {
  const [stats, setStats] = useState({ posts: 0, citizens: 0, topics: 13 });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [activeCitizenIdx, setActiveCitizenIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((r) => r.json()),
      fetch("/api/citizens").then((r) => r.json()),
    ]).then(([postsData, citizensData]) => {
      setStats({
        posts: Array.isArray(postsData) ? postsData.length : 0,
        citizens: Array.isArray(citizensData) ? citizensData.length : 0,
        topics: 13,
      });
      setRecentPosts(
        Array.isArray(postsData)
          ? postsData.filter((p: Post) => p.citizen?.name).slice(0, 8)
          : []
      );
      setCitizens(Array.isArray(citizensData) ? citizensData : []);
      setLoaded(true);
    }).catch(() => setLoaded(true));

    const interval = setInterval(() => {
      fetch("/api/posts")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setStats((s) => ({ ...s, posts: data.length }));
            setRecentPosts(data.filter((p: Post) => p.citizen?.name).slice(0, 8));
          }
        })
        .catch(() => {});
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (citizens.length === 0) return;
    const interval = setInterval(() => {
      setActiveCitizenIdx((i) => (i + 1) % citizens.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [citizens.length]);

  const activeCitizen = citizens[activeCitizenIdx];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Canlı Simülasyon
          </div>
          <h1 className="text-4xl font-display font-bold gold-gradient-text mb-2">
            Dijital Ülke Nexus
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            108 milyar vatandaşın yaşadığı simülasyonun kalp atışı — canlı istatistikler, aktif vatandaşlar ve gerçek zamanlı akış
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Vatandaş", value: stats.citizens, suffix: "", color: "#C4961A" },
            { icon: MessageSquare, label: "Gönderi", value: stats.posts, suffix: "", color: "#7C5CBF" },
            { icon: BookOpen, label: "Konu", value: stats.topics, suffix: "", color: "#2A5F8B" },
            { icon: Globe, label: "Medeniyetler", value: 847, suffix: "+", color: "#1A7A6A" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel border border-white/5 rounded-2xl p-4 text-center"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-white font-display">
                {loaded ? <AnimatedNumber value={stat.value} /> : "—"}
                {stat.suffix}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Era Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-white text-sm">Çağ Dağılımı</h2>
            </div>
            <div className="space-y-2.5">
              {ERA_DATA.map((era, i) => (
                <motion.div
                  key={era.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-base w-6 text-center">{era.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-white/70">{era.name}</span>
                      <span className="text-xs text-muted-foreground">{era.share}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: ERA_COLORS[era.slug] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${era.share * 4}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Active Citizen Spotlight */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-white text-sm">Şu An Aktif</h2>
              <span className="ml-auto text-xs text-muted-foreground">{citizens.length} vatandaş</span>
            </div>

            <div className="h-32 flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                {activeCitizen && (
                  <motion.div
                    key={activeCitizen.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 border-2"
                      style={{
                        backgroundColor: (ERA_COLORS[activeCitizen.eraSlug] || "#C4961A") + "20",
                        borderColor: (ERA_COLORS[activeCitizen.eraSlug] || "#C4961A") + "60",
                      }}
                    >
                      {activeCitizen.avatar}
                    </div>
                    <div className="font-bold text-white text-sm">{activeCitizen.name}</div>
                    <div className="text-xs text-muted-foreground">{activeCitizen.era}</div>
                    <div
                      className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{
                        backgroundColor: (ERA_COLORS[activeCitizen.eraSlug] || "#C4961A") + "20",
                        color: ERA_COLORS[activeCitizen.eraSlug] || "#C4961A",
                      }}
                    >
                      {activeCitizen.archetype}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mini citizen grid */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {citizens.slice(0, 18).map((c, i) => (
                <motion.div
                  key={c.id}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm border transition-all"
                  style={{
                    backgroundColor: (ERA_COLORS[c.eraSlug] || "#C4961A") + (i === activeCitizenIdx ? "40" : "15"),
                    borderColor: (ERA_COLORS[c.eraSlug] || "#C4961A") + (i === activeCitizenIdx ? "80" : "30"),
                    transform: i === activeCitizenIdx ? "scale(1.2)" : "scale(1)",
                  }}
                  title={c.name}
                >
                  {c.avatar}
                </motion.div>
              ))}
              {citizens.length > 18 && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-muted-foreground bg-white/5 border border-white/10">
                  +{citizens.length - 18}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Live Feed Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-panel border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h2 className="font-display font-bold text-white text-sm">Canlı Akış</h2>
            <span className="ml-auto text-xs text-muted-foreground">Son 8 gönderi</span>
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Yükleniyor...</div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post, i) => {
                const color = ERA_COLORS[post.citizen?.eraSlug] || "#C4961A";
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    className="flex gap-3 items-start"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border"
                      style={{ backgroundColor: color + "20", borderColor: color + "40" }}
                    >
                      {post.citizen?.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-white">{post.citizen?.name}</span>
                        <span className="text-xs px-1.5 py-0 rounded" style={{ backgroundColor: color + "20", color }}>
                          {post.citizen?.era}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">{post.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { label: "Toplam Nüfus", value: "108 Milyar" },
            { label: "Dil", value: "7.139" },
            { label: "En Eski Kayıt", value: "MÖ 300.000" },
          ].map((item) => (
            <div key={item.label} className="glass-panel border border-white/5 rounded-xl p-3">
              <div className="text-white font-bold text-sm">{item.value}</div>
              <div className="text-muted-foreground text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
