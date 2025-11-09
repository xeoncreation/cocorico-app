"use client";
import { supabase } from "@/app/lib/supabase-client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function AuthButton() {
  const t = useTranslations();
  const [session, setSession] = useState<Session | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setMessage(null);

    // Store current path (if not home) for post-login redirect
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      localStorage.setItem('authReturnTo', currentPath);
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setMessage({ text: t('auth.magiclink.error', { message: error.message }), type: 'error' });
    } else {
      setMessage({ text: t('auth.magiclink.sent'), type: 'success' });
      setShowEmailInput(false);
      setEmail("");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!session) {
    if (showEmailInput) {
      return (
        <div className="relative">
          {/* Dropdown container repositioned to avoid clipping & ensure full visibility */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 bg-white dark:bg-neutral-800 py-5 px-5 rounded-xl shadow-lg border border-cocorico-yellow/60 dark:border-neutral-600 absolute right-0 top-[110%] min-w-[300px] z-[200] overflow-visible"
          >
            <label className="text-xs font-semibold text-cocorico-brown dark:text-neutral-300 tracking-wide">
              {t('auth.emailPlaceholder')}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-neutral-700 border border-cocorico-yellow/50 dark:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-cocorico-red/70 focus:border-cocorico-red text-sm shadow-inner"
                disabled={loading}
              />
              {/* Decorative top overlay to ensure border not visually clipped */}
              <div className="pointer-events-none absolute -top-2 left-2 right-2 h-2 bg-gradient-to-b from-white dark:from-neutral-800 to-transparent" />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-cocorico-red text-white hover:bg-cocorico-orange transition disabled:opacity-50 font-semibold text-sm"
              >
                {loading ? t('common.sending') : t('auth.sendLink')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEmailInput(false);
                  setEmail("");
                  setMessage(null);
                }}
                className="px-4 py-2 rounded-lg border border-cocorico-brown/60 text-cocorico-brown dark:text-neutral-300 dark:border-neutral-500 hover:bg-cocorico-yellow/20 dark:hover:bg-neutral-700 transition text-sm"
              >
                {t('common.cancel')}
              </button>
            </div>
            {message && (
              <div
                className={`mt-1 p-3 rounded-lg text-xs leading-relaxed font-medium ${
                  message.type === 'error'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      );
    }
    return (
      <button
        onClick={() => setShowEmailInput(true)}
        className="px-4 py-2 rounded-lg bg-cocorico-yellow text-cocorico-red hover:bg-cocorico-orange/90 transition font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cocorico-red/60"
      >
        🔑 {t('auth.login')}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-cocorico-brown hidden md:inline font-medium">✓ {session.user.email}</span>
      <button 
        onClick={signOut} 
        className="px-3 py-1.5 rounded-lg bg-cocorico-red text-white hover:bg-cocorico-orange transition text-xs font-semibold"
      >
  {t('auth.logout')}
      </button>
    </div>
  );
}
