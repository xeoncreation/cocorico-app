import { createClient } from "@supabase/supabase-js";
// Si tienes tipos generados de Supabase, importa Database y tipa el cliente.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// IMPORTANTE: este cliente SOLO se usa en código de servidor (API routes, server actions)
// Si SUPABASE_SERVICE_ROLE_KEY no está configurado, el cliente se crea pero fallará al usarse
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;
