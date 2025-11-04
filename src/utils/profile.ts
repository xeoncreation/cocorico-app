import { supabase } from "@/app/lib/supabase-client";

export interface UserProfile {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  language: string;
  country: string | null;
  experience: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export async function getProfile(): Promise<UserProfile> {
  const { data, error } = await (supabase as any)
    .from("user_profiles")
    .select("*")
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProfile(profile: Partial<UserProfile>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await (supabase as any)
    .from("user_profiles")
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
  
  if (error) throw error;
}

export async function addExperience(amount: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await (supabase as any).rpc("add_xp", {
    p_user: user.id,
    p_amount: amount
  });

  if (error) throw error;
}
