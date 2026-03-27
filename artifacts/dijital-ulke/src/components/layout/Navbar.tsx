import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Globe, Users, Database, Rss, BookOpen } from "lucide-react";
import { clsx } from "clsx";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/feed", label: "Akış", icon: Rss },
    { href: "/topics", label: "Konular", icon: BookOpen },
    { href: "/citizens", label: "Vatandaşlar", icon: Users },
    { href: "/nexus", label: "Nexus", icon: Globe },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/5 border-b shadow-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors">
            <Database className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl gold-gradient-text tracking-widest uppercase">
              Dijital Ülke
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Simülasyon Ağı</p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/feed"
                ? location === "/feed" || location === "/"
                : location === link.href ||
                  (link.href !== "/" && location.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors overflow-hidden group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={clsx(
                    "w-4 h-4 relative z-10",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )}
                />
                <span className="relative z-10 hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
