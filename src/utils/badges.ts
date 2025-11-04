import { supabase } from "@/app/lib/supabase-client";

export interface Badge {
  id: number;
  user_id: string;
  badge_code: string;
  badge_name: string;
  description: string;
  icon_url: string;
  earned_at: string;
}

export async function getBadges(): Promise<Badge[]> {
  const { data, error } = await (supabase as any)
    .from("user_badges")
    .select("*")
    .order("earned_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function assignBadge(badgeCode: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await (supabase as any).rpc("assign_badge", {
    p_user: user.id,
    p_code: badgeCode
  });

  if (error) throw error;
}

// Helper para verificar si un usuario tiene un badge específico
export async function hasBadge(badgeCode: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await (supabase as any)
    .from("user_badges")
    .select("id")
    .eq("user_id", user.id)
    .eq("badge_code", badgeCode)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}
