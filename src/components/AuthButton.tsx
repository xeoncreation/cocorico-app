"use client";
import { supabase } from "@/app/lib/supabase-client";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    
    // Auto-open login if auth=required parameter is present
    if (searchParams && typeof searchParams.get === 'function' && searchParams.get('auth') === 'required') {
      setShowEmailInput(true);
    }
    
    return () => sub.subscription.unsubscribe();
  }, [searchParams]);

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
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: "Te enviamos un email con el enlace de acceso. Revísalo y vuelve aquí 👌", type: 'success' });
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg border-2 border-cocorico-yellow">
            {searchParams && typeof searchParams.get === 'function' && searchParams.get('auth') === 'required' && (
              <div className="mb-2 p-2 rounded bg-cocorico-orange/20 border border-cocorico-orange text-sm text-cocorico-brown font-medium">
                🔒 Debes iniciar sesión para acceder
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className="px-3 py-2 border-2 border-cocorico-yellow/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cocorico-red focus:border-cocorico-red"
              disabled={loading}
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-cocorico-red text-white hover:bg-cocorico-orange transition disabled:opacity-50 font-semibold"
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowEmailInput(false);
                  setEmail("");
                  setMessage(null);
                }}
                className="px-4 py-2 rounded-lg border-2 border-cocorico-brown text-cocorico-brown hover:bg-cocorico-yellow/20 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
          {message && (
            <div className={`mt-2 p-3 rounded-lg text-sm font-medium ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      );
    }
    return (
      <button 
        onClick={() => setShowEmailInput(true)} 
        className="px-4 py-2 rounded-lg bg-cocorico-yellow text-cocorico-red hover:bg-cocorico-orange/90 transition font-semibold text-sm"
      >
        🔑 Iniciar sesión
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-cocorico-brown hidden md:inline font-medium">
        ✓ {session.user.email}
      </span>
      <button 
        onClick={signOut} 
        className="px-3 py-1.5 rounded-lg bg-cocorico-red text-white hover:bg-cocorico-orange transition text-xs font-semibold"
      >
        Salir
      </button>
    </div>
  );
}
