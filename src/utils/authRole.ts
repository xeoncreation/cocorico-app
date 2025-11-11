import { supabaseServer } from "@/lib/supabase-client";
// Updated to use user_profiles table instead of legacy user_roles

/**
 * Verifica si un usuario tiene rol de administrador
 * @param userId - UUID del usuario a verificar
 * @returns true si el usuario es admin, false en caso contrario
 */
export async function isAdmin(userId: string): Promise<boolean> {
  if (!supabaseServer) return false;
  const { data } = await (supabaseServer as any)
    .from("user_profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

/**
 * Obtiene el rol de un usuario
 * @param userId - UUID del usuario
 * @returns 'user' | 'admin' | null
 */
export async function getUserRole(userId: string): Promise<string | null> {
  if (!supabaseServer) return null;
  const { data } = await (supabaseServer as any)
    .from("user_profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.role || null;
}
