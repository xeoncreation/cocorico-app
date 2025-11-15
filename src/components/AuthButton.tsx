"use client";
import { supabase } from "@/app/lib/supabase-client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const t = useTranslations();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (!session) {
    return (
      <button
        onClick={() => router.push('/login')}
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
