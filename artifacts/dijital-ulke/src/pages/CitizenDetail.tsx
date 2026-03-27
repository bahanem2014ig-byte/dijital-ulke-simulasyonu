import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, BookOpen, Fingerprint, Calendar, Shield } from "lucide-react";
import { useGetCitizen, useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { CitizenAvatar } from "@/components/ui/citizen-avatar";

export default function CitizenDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { data: citizen, isLoading } = useGetCitizen(id || "");
  const createChat = useCreateOpenaiConversation();

  const handleStartChat = () => {
    if (!citizen) return;
    createChat.mutate(
      { data: { title: `${citizen.name} ile Görüşme`, citizenId: citizen.id } },
      {
        onSuccess: (data) => {
          setLocation(`/chat/${data.id}?citizenId=${citizen.id}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-10 w-full animate-pulse">
          <div className="h-8 w-24 bg-white/5 rounded mb-8" />
          <div className="glass-panel p-8 rounded-3xl h-[60vh]" />
        </div>
      </Layout>
    );
  }

  if (!citizen) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display text-white">Vatandaş bulunamadı</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Geri Dön
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Avatar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-3xl text-center border-t border-white/10"
            >
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl shadow-primary/10 mb-6 relative bg-secondary/80">
                <CitizenAvatar avatar={citizen.avatar} name={citizen.name} size="lg" />
                <div className="absolute inset-0 border border-white/20 rounded-full z-10 pointer-events-none" />
              </div>
              <h1 className="text-3xl font-display font-bold gold-gradient-text mb-2">{citizen.name}</h1>
              <p className="text-primary/80 font-medium uppercase tracking-widest text-xs mb-4">{citizen.archetype}</p>
              
              <button 
                onClick={handleStartChat}
                disabled={createChat.isPending}
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-yellow-600 text-background shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createChat.isPending ? "Bağlantı Kuruluyor..." : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Bilinçle Konuş
                  </>
                )}
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-3xl"
            >
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Özellikler
              </h3>
              <div className="flex flex-wrap gap-2">
                {citizen.traits.map(trait => (
                  <span key={trait} className="px-3 py-1.5 rounded-lg bg-secondary border border-white/5 text-sm text-foreground/80">
                    {trait}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-8 rounded-3xl h-full"
            >
              <div className="flex items-start gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-1">Simülasyon Profili</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {citizen.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5">
                  <div className="flex items-center gap-2 text-primary/70 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Dönem</span>
                  </div>
                  <p className="text-lg font-display text-white">{citizen.era}</p>
                  <p className="text-sm text-muted-foreground">{citizen.yearsLived}</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5">
                  <div className="flex items-center gap-2 text-accent/70 mb-2">
                    <Fingerprint className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Medeniyet</span>
                  </div>
                  <p className="text-lg font-display text-white">{citizen.civilization}</p>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-[#080d1a] border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <h4 className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Veri Kaynağı</h4>
                <p className="text-muted-foreground text-sm italic">
                  "{citizen.source}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
