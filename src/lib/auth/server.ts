/**
 * Auth utilities - Server-side only
 * SECURITY: Este módulo SOLO debe importarse desde server components/API routes
 */

import { createRouteHandlerClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

/**
 * Obtener usuario autenticado (server-side)
 * Retorna null si no hay sesión válida
 */
export async function getServerUser() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Requerir autenticación (server-side)
 * Redirige a /login si no hay usuario
 */
export async function requireAuth(redirectTo?: string) {
  const user = await getServerUser();
  if (!user) {
    const params = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
    redirect(`/es/login${params}`);
  }
  return user;
}

/**
 * Verificar si usuario tiene rol específico
 */
export async function hasRole(requiredRole: 'admin' | 'premium' | 'user') {
  const supabase = await createRouteHandlerClient();
  const user = await getServerUser();
  
  if (!user) return false;

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!data) return requiredRole === 'user'; // Default role

  if (requiredRole === 'admin') return data.role === 'admin';
  if (requiredRole === 'premium') return ['admin', 'premium', 'pro_user'].includes(data.role);
  return true; // All authenticated users have 'user' role
}

/**
 * Requerir rol específico (server-side)
 * Redirige a /unauthorized si no tiene permisos
 */
export async function requireRole(role: 'admin' | 'premium' | 'user') {
  const hasAccess = await hasRole(role);
  if (!hasAccess) {
    redirect('/es/unauthorized');
  }
}

/**
 * Obtener nivel de autenticación multifactor
 * Retorna 'aal1' (password) o 'aal2' (password + MFA)
 */
export async function getMFALevel() {
  const supabase = await createRouteHandlerClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.aal ?? 'aal1';
}

/**
 * Verificar si MFA está habilitado para usuario actual
 */
export async function hasMFAEnabled() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data } = await supabase.auth.mfa.listFactors();
  return data && data.all.length > 0;
}
