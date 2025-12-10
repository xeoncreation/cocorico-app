"use client";

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Create the client only if env vars are present to avoid crashing dev server
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client: SupabaseClient<Database> | null = null;
if (URL && ANON) {
  _client = createSupabaseClient<Database>(URL, ANON);
} else if (typeof window !== 'undefined') {
  // Warn only in browser to reduce server noise
  console.warn('[Supabase] Falta configuración NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = _client as unknown as SupabaseClient<Database>;

// Export para compatibilidad con imports que usan createClient
export const createClient = () => {
  if (!URL || !ANON) {
    throw new Error('[Supabase] Falta configuración NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createSupabaseClient<Database>(URL, ANON);
};
