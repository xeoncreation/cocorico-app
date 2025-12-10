/**
 * Auth utilities - Client-side only
 * SECURITY: Este módulo puede importarse desde "use client" components
 */

'use client';

import { createClientComponentClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Hook para obtener usuario actual (client-side)
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { user, loading };
}

/**
 * Hook para requerir autenticación (client-side)
 * Redirige a /login si no hay usuario
 */
export function useRequireAuth() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/es/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Cerrar sesión
 */
export async function signOut() {
  const supabase = createClientComponentClient();
  await supabase.auth.signOut();
  window.location.href = '/es';
}

/**
 * Registrar usuario
 */
export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/es/auth/callback`
    }
  });

  return { data, error };
}

/**
 * Iniciar sesión
 */
export async function signIn(email: string, password: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  return { data, error };
}

/**
 * Recuperar contraseña
 */
export async function resetPassword(email: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/es/auth/reset-password`
  });

  return { data, error };
}

/**
 * Actualizar contraseña
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  return { data, error };
}
