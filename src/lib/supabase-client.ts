/**
 * Central supabase client exports.
 * - `supabaseServer` is a server-side client (created in src/lib/supabase.ts)
 * - For browser/client usage continue importing from `src/app/lib/supabase-client.ts` which
 *   is a client-marked module and uses the auth-helpers package.
 *
 * This file intentionally avoids importing client-only helpers so it can be used safely
 * from server components or API routes.
 */
import { supabaseServer } from './supabase';

export { supabaseServer };

export default supabaseServer;
