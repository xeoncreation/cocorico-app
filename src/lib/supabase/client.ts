import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente Supabase para componentes del navegador ("use client")
 * No importa next/headers - seguro para componentes cliente
 */
export function createClientComponentClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Las funciones de servidor se han movido a src/lib/supabase/server.ts
// para evitar importar next/headers en componentes cliente
