"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase-client";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="font-display text-2xl text-cocorico-red dark:text-amber-300">
        <Link href="/">Cocorico</Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="space-x-6 text-sm font-semibold text-cocorico-brown dark:text-neutral-200">
          <Link href="/chat" className="hover:text-cocorico-red">Chat</Link>
          <Link href="/dashboard/favorites" className="hover:text-cocorico-red">Favoritos</Link>
          <Link href="/dashboard/stats" className="hover:text-cocorico-red">Estadísticas</Link>
        </div>
        
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-full bg-cocorico-yellow/20 dark:bg-amber-700/30 px-3 py-1.5 text-sm font-medium hover:bg-cocorico-yellow/30"
            >
              <div className="w-6 h-6 rounded-full bg-cocorico-red text-white flex items-center justify-center text-xs font-bold">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="max-w-[120px] truncate">{user.email}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-sm font-semibold text-cocorico-brown dark:text-neutral-200 hover:text-cocorico-red">
            Iniciar sesión
          </Link>
        )}
        
        <LanguageSelector compact />
        <ThemeToggle />
      </div>
    </nav>
  );
}
