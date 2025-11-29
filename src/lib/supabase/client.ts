import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Cliente Supabase para componentes del navegador ("use client")
 */
export function createClientComponentClient() {
  // If the public supabase keys are missing (common during local dev without secrets),
  // return a safe no-op client so client components don't crash. Tests and statically
  // rendered pages can still load without a configured Supabase instance.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  // Minimal, resilient no-op client. It implements the common surfaces used by the
  // app (auth, from(), storage, functions, etc.) but performs no network activity
  // and returns safe default shapes. This prevents components from throwing when
  // Supabase is intentionally unconfigured in e.g. CI/test/local placeholder envs.
  const noopPromise = async (value?: any) => ({ data: value ?? null, error: null });

  const makeFrom = () => ({
    select: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
    eq: () => makeFrom(),
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    limit: () => makeFrom(),
    order: () => makeFrom(),
  });

  const storageFrom = (_bucketName: string) => ({
    upload: async () => ({ data: { path: '' }, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
    remove: async () => ({ data: null, error: null }),
    list: async () => ({ data: [], error: null }),
  });

  const noopClient: any = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: (cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ data: null, error: null }),
    },
    from: (_table: string) => makeFrom(),
    storage: {
      from: storageFrom,
    },
    functions: {
      invoke: async () => ({ data: null, error: null }),
    },
    rpc: async () => ({ data: null, error: null }),
  };

  return noopClient as any;
}

/**
 * Cliente Supabase para Server Components
 * IMPORTANTE: Esta función debe llamarse dentro de componentes async
 */
export async function createServerComponentClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a safe server-side no-op client when env vars are missing to avoid
    // runtime crashes during dev/test where Supabase isn't configured.
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: (_: string) => ({ select: async () => ({ data: null, error: null }) }),
      storage: { from: (_: string) => ({ list: async () => ({ data: [], error: null }) }) },
      functions: { invoke: async () => ({ data: null, error: null }) },
      rpc: async () => ({ data: null, error: null }),
    } as any;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Cliente Supabase para Route Handlers (API routes)
 */
export async function createRouteHandlerClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: (_: string) => ({ select: async () => ({ data: null, error: null }) }),
      storage: { from: (_: string) => ({ list: async () => ({ data: [], error: null }) }) },
      functions: { invoke: async () => ({ data: null, error: null }) },
      rpc: async () => ({ data: null, error: null }),
    } as any;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
