"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase-client";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<string>("Finalizando autenticación...");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function finalize() {
      try {
        // Get returnTo from URL or localStorage
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('returnTo') || localStorage.getItem('authReturnTo') || '/';
        localStorage.removeItem('authReturnTo'); // Clear it after reading

        // Exchange the code for a session using the new method
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash);

        if (error) {
          console.error("Supabase auth callback error:", error);
          if (mounted) setStatus(`Error al finalizar sesión: ${error.message}`);
          // Let user see the message briefly then go home
          setTimeout(() => router.replace('/'), 2500);
          return;
        }

        // Success -> redirect to returnTo URL or home
        if (mounted) setStatus("Autenticación completada. Redirigiendo…");
        router.replace(returnTo);
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        if (mounted) setStatus('Error inesperado al finalizar autenticación.');
        setTimeout(() => router.replace('/'), 3000);
      }
    }

    finalize();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="p-6 rounded-lg bg-white dark:bg-zinc-900 shadow">
        <h1 className="text-lg font-medium mb-2">Finalizando autenticación</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{status}</p>
      </div>
    </div>
  );
}
