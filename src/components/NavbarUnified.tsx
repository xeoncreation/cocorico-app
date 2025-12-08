"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase-client";
import { 
  MessageCircle, 
  ScanLine, 
  BookOpen, 
  Users, 
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Heart
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { 
    href: "/chat-unificado", 
    label: "Chat", 
    icon: MessageCircle,
    description: "Habla con Cocorico"
  },
  { 
    href: "/analisis", 
    label: "Análisis", 
    icon: ScanLine,
    description: "Escanea y analiza"
  },
  { 
    href: "/mis-recetas", 
    label: "Mis Recetas", 
    icon: BookOpen,
    description: "Tus colecciones"
  },
  { 
    href: "/comunidad", 
    label: "Comunidad", 
    icon: Users,
    description: "Conecta con otros"
  },
];

export default function NavbarUnified() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  const isActive = (path: string) => pathname?.includes(path);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🐓</span>
              <span className="text-xl font-bold text-white group-hover:text-cocorico-naranja transition-colors">
                Cocorico
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                      active
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-cocorico-naranja/20 rounded-xl border border-cocorico-naranja/40"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu / Login */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cocorico-naranja to-cocorico-turquoise flex items-center justify-center text-white text-sm font-bold">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-white text-sm font-medium max-w-[120px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white text-sm font-medium truncate">{user.email}</p>
                        </div>
                        
                        <Link
                          href="/mis-recetas"
                          className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">Mis Favoritos</span>
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Configuración</span>
                        </Link>
                        
                        <div className="border-t border-white/10">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Cerrar sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cocorico-naranja hover:bg-cocorico-naranja/90 text-white font-medium text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-neutral-950/95 backdrop-blur-xl"
            style={{ paddingTop: "4rem" }}
          >
            <div className="p-6 space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-2xl transition-all",
                      active
                        ? "bg-cocorico-naranja/20 border border-cocorico-naranja/40 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-white/60">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
