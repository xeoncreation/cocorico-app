import { supabaseServer } from "@/lib/supabase-client";

/** Max de prompts/día para free */
export const FREE_DAILY_LIMIT = 25;

export async function canUseAI(userId: string): Promise<{ok: boolean; reason?: string}> {
  const sb = supabaseServer;
  if (!sb) return { ok: false, reason: 'db_not_configured' };

  // ¿Es premium?
  const { data: sub } = await sb.from('user_subscriptions').select('status').eq('user_id', userId).maybeSingle();
  if (sub?.status === 'active') return { ok: true };

  // Free: cuota diaria
  const { data: quota } = await sb.from('usage_quota').select('*').eq('user_id', userId).maybeSingle();

  // reset si toca
  if (quota && new Date(quota.reset_at) < new Date()) {
    await sb.from('usage_quota').upsert({ user_id: userId, daily_calls: 0, reset_at: new Date(Date.now() + 86400000).toISOString() });
    return { ok: true };
  }

  const used = (quota as any)?.daily_calls ?? 0;
  if (used >= FREE_DAILY_LIMIT) return { ok: false, reason: 'limit_reached' };

  return { ok: true };
}

export async function incrementAI(userId: string) {
  const sb = supabaseServer;
  if (!sb) return;
  try {
    await sb.rpc('increment_ai_usage', { p_user_id: userId });
  } catch {
    // si no existe la row, la creamos a 1
    await sb.from('usage_quota').upsert({ user_id: userId, daily_calls: 1, reset_at: new Date(Date.now() + 86400000).toISOString() });
  }
}
