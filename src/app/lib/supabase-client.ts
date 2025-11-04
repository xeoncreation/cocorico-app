"use client";

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Create the client only if env vars are present to avoid crashing dev server
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client: SupabaseClient<Database> | null = null;
if (URL && ANON) {
  _client = createClient<Database>(URL, ANON);
} else if (typeof window !== 'undefined') {
  // Warn only in browser to reduce server noise
  console.warn('[Supabase] Falta configuración NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = _client as unknown as SupabaseClient<Database>;
