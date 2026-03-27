import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Fingerprint, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { useListCitizens, useListEras, useCreateOpenaiConversation } from "@workspace/api-client-react";
import type { Citizen } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { CitizenAvatar } from "@/components/ui/citizen-avatar";

function CitizenCard({ citizen }: { citizen: Citizen }) {
  const [, setLocation] = useLocation();
  const createChat = useCreateOpenaiConversation();

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    createChat.mutate(
      { data: { title: `${citizen.name} ile Görüşme`, citizenId: citizen.id } },
      { onSuccess: (data) => setLocation(`/chat/${data.id}?citizenId=${citizen.id}`) }
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="flex flex-col h-full glass-panel rounded-2xl border border-white/5 hover:border-primary/40 transition-all duration-300 overflow-hidden">
        <Link href={`/citizens/${citizen.id}`} className="block p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors bg-secondary/80">
                <CitizenAvatar avatar={citizen.avatar} name={citizen.name} size="sm" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-background border border-white/10 rounded-full p-1">
                {citizen.eraSlug === "modern" || citizen.eraSlug === "digital" ? (
                  <Sparkles className="w-3 h-3 text-accent" />
                ) : (
                  <Fingerprint className="w-3 h-3 text-primary" />
                )}
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-white/10 bg-white/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {citizen.archetype}
            </span>
          </div>

          <h3 className="text-xl font-display font-bold text-foreground mb-1">{citizen.name}</h3>
          <p className="text-sm text-primary/80 mb-3">{citizen.civilization} • {citizen.yearsLived}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{citizen.description}</p>

          <div className="flex flex-wrap gap-2">
            {citizen.traits.slice(0, 3).map((trait) => (
              <span key={trait} className="text-xs px-2 py-1 rounded bg-secondary/50 text-foreground/70 border border-white/5">
                {trait}
              </span>
            ))}
          </div>
        </Link>

        <div className="px-6 pb-5">
          <button
            onClick={handleChat}
            disabled={createChat.isPending}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/30 hover:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createChat.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Bağlanıyor...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                Sohbet Başlat
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Citizens() {
  const [search, setSearch] = useState("");
  const [selectedEra, setSelectedEra] = useState<string>("");

  const { data: citizens, isLoading } = useListCitizens({
    search: search || undefined,
    era: selectedEra || undefined,
  });

  const { data: eras } = useListEras();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold gold-gradient-text mb-2">Simülasyon Vatandaşları</h1>
            <p className="text-muted-foreground">İnsanlık tarihinin dijital kopyalarıyla tanışın.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="İsim veya medeniyet ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-foreground appearance-none"
              >
                <option value="">Tüm Çağlar</option>
                {eras?.map((e) => (
                  <option key={e.slug} value={e.slug}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 glass-panel rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : citizens?.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <Fingerprint className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-display font-medium text-foreground mb-2">Eşleşen Vatandaş Bulunamadı</h3>
            <p className="text-muted-foreground">Farklı bir arama veya filtre deneyin.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {citizens?.map((citizen) => (
                <CitizenCard key={citizen.id} citizen={citizen} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
