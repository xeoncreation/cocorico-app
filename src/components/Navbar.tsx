"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase-client";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) return;
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for auth changes
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

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  const navLinkClass = (path: string) => 
    `hover:text-cocorico-red dark:hover:text-amber-400 transition-colors drop-shadow-sm ${
      isActive(path) 
        ? 'text-cocorico-red dark:text-amber-400 font-black border-b-3 border-cocorico-red dark:border-amber-400' 
        : 'text-neutral-900 dark:text-white font-bold'
    }`;

  return (
    <nav className="navbar-liquid flex items-center justify-between px-6 py-3 border-b border-white/30 dark:border-white/20 shadow-lg">
      <div className="font-display text-2xl font-black text-cocorico-red dark:text-amber-400 drop-shadow-md">
        <Link href="/">Cocorico</Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex space-x-4 text-sm font-bold">
          <Link href="/chat" className={navLinkClass("/chat")}>Chat</Link>
          <Link href="/scanner" className={navLinkClass("/scanner")}>Escáner</Link>
          <Link href="/recipes" className={navLinkClass("/recipes")}>Recetas</Link>
          <Link href="/learn" className={navLinkClass("/learn")}>Aprender</Link>
          <Link href="/community" className={navLinkClass("/community")}>Comunidad</Link>
          <Link href="/dashboard/challenges" className={navLinkClass("/dashboard/challenges")}>Retos</Link>
          <Link href="/pricing" className={navLinkClass("/pricing")}>Premium</Link>
        </div>
        
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ios-clear-button flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-cocorico-red text-white flex items-center justify-center text-xs font-bold">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="max-w-[120px] truncate">{user.email}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 ios-clear-button rounded-md shadow-lg py-1 z-50">
                <Link 
                  href="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/20 rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  href="/dashboard/achievements"
                  className="block px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/20 rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  🏆 Logros
                </Link>
                <Link 
                  href="/dashboard/favorites"
                  className="block px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/20 rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  ⭐ Favoritos
                </Link>
                <Link 
                  href="/dashboard/feedback"
                  className="block px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/20 rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  📝 Feedback
                </Link>
                <Link 
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/20 rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  ⚙️ Configuración
                </Link>
                <div className="border-t border-white/30 dark:border-white/20 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/20 rounded text-red-600 dark:text-red-400 transition-colors"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-sm font-semibold text-neutral-900 dark:text-white hover:text-cocorico-red dark:hover:text-amber-400 transition-colors">
            Iniciar sesión
          </Link>
        )}
        
        <LanguageSelector compact />
        <ThemeToggle />
      </div>
    </nav>
  );
}
