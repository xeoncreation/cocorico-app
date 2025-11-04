import { supabaseServer } from "@/lib/supabase-client";
import type { AIProfile, AIMsg } from "@/schemas/ai";

export async function getOrCreateThread(userId: string) {
  const sb = supabaseServer;
  if (!sb) throw new Error("Database not configured");
  const { data } = await sb.from('ai_threads').select('id').eq('user_id', userId).order('id', { ascending: true }).limit(1).maybeSingle();
  if (data) return data.id as number;
  const { data: created, error } = await sb.from('ai_threads').insert({ user_id: userId, title: 'Conversación' }).select('id').single();
  if (error) throw error;
  return created!.id as number;
}

export async function getShortMemory(threadId: number, userId: string, limit = 8): Promise<AIMsg[]> {
  const sb = supabaseServer;
  if (!sb) throw new Error("Database not configured");
  const { data } = await sb
    .from('ai_messages')
    .select('role,content')
    .eq('thread_id', threadId)
    .eq('user_id', userId)
    .order('id', { ascending: false })
    .limit(limit);
  return (data || []).reverse() as AIMsg[];
}

export async function getProfile(userId: string): Promise<AIProfile> {
  const sb = supabaseServer;
  if (!sb) throw new Error("Database not configured");
  const { data } = await sb.from('ai_profiles').select('*').eq('user_id', userId).maybeSingle();
  if (data) return data as AIProfile;
  // crea perfil por defecto
  const { data: created } = await sb.from('ai_profiles').insert({ user_id: userId }).select('*').single();
  return created as AIProfile;
}

export async function saveMessage(threadId: number, userId: string, role: 'user'|'assistant', content: string) {
  const sb = supabaseServer;
  if (!sb) throw new Error("Database not configured");
  await sb.from('ai_messages').insert({ thread_id: threadId, user_id: userId, role, content });
}
