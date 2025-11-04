/**
 * Central Supabase helpers
 * - createBrowserSupabase: returns a browser client (for use in client components)
 * - supabaseServer: a basic server-side client (uses SERVICE_ROLE if provided, otherwise anon)
 *
 * Note: Do not commit secrets. Keep service role keys out of NEXT_PUBLIC_* variables.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-side client. Prefer using a non-public service role key for privileged server operations.
let supabaseServer: SupabaseClient | null = null;
if (SUPABASE_URL && (SUPABASE_SERVICE_ROLE || SUPABASE_ANON)) {
  supabaseServer = createClient(
    SUPABASE_URL,
    (SUPABASE_SERVICE_ROLE as string | undefined) ?? (SUPABASE_ANON as string)
  );
} else {
  // Avoid crashing the dev server when env vars are not present.
  // API routes that rely on Supabase will respond with 500 until configured.
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Supabase] Falta configuración NEXT_PUBLIC_SUPABASE_URL o claves. El servidor seguirá arrancando pero las APIs de BD fallarán hasta configurarlo.");
  }
}

export { supabaseServer };
export default supabaseServer as unknown as SupabaseClient;
