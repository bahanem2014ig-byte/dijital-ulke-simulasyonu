import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Clock, TrendingUp, List } from "lucide-react";

interface Topic {
  id: number;
  icon: string;
  title: string;
  description: string;
  period: string;
  eraSlug: string;
  createdAt: string;
  replyCount?: number;
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

const ERA_NAMES: Record<string, string> = {
  prehistoric: "Prehistorik",
  neolithic: "Neolitik",
  ancient: "Antik",
  classical: "Klasik",
  medieval: "Orta Çağ",
  earlymodern: "Erken Modern",
  industrial: "Sanayi",
  digital: "Dijital",
};

export default function Topics() {
  const [topicsData, setTopicsData] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<"default" | "trending">("default");
  const [, navigate] = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const url = sort === "trending" ? "/api/topics?sort=trending" : "/api/topics";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setTopicsData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [sort]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold gold-gradient-text mb-1">
            Tarihin Büyük Konuları
          </h1>
          <p className="text-muted-foreground text-sm">
            Dünyayı değiştiren olaylar — tüm çağların vatandaşları tartışıyor
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSort("default")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${sort === "default" ? "bg-primary text-background border-primary" : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white"}`}
            >
              <List className="w-3 h-3" />
              Kronolojik
            </button>
            <button
              onClick={() => setSort("trending")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${sort === "trending" ? "bg-primary text-background border-primary" : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-white"}`}
            >
              <TrendingUp className="w-3 h-3" />
              Trend
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 glass-panel rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="space-y-3">
            {topicsData.map((topic, i) => {
              const color = ERA_COLORS[topic.eraSlug] || "#C4961A";
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-panel border border-white/5 hover:border-white/15 rounded-2xl px-5 py-4 cursor-pointer group transition-all hover:scale-[1.01]"
                  onClick={() => navigate(`/topics/${topic.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: color + "20", border: `1px solid ${color}40` }}
                    >
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors leading-snug">
                          {topic.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                      </div>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: color + "20",
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {ERA_NAMES[topic.eraSlug] || topic.eraSlug}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Clock className="w-3 h-3" />
                          {topic.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
