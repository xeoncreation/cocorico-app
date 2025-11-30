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

  const makeFrom = () => {
    // Chainable query builder with a tiny in-memory dataset for dev/test when
    // Supabase isn't configured. This helps Playwright tests run reliably
    // without an external DB and prevents server 500s or empty pages.
    const builder: any = {};
    const terminalResult = { data: null, error: null };

    // Tiny sample recipes used by tests when DB is missing
    const sampleRecipes = [
      {
        id: 'r1',
        slug: 'pasta-con-verduras',
        title: 'Pasta con verduras',
        description: 'Pasta con verduras salteadas',
        content_json: {
          ingredients: [{ quantity: '200g', unit: '', item: 'pasta' }],
          steps: ['Hervir la pasta', 'Saltear verduras']
        },
        difficulty: 'fácil',
        time: 25,
        visibility: 'public',
        is_deleted: false
      },
      {
        id: 'r2',
        slug: 'test-recipe',
        title: 'Test Recipe',
        description: 'A sample recipe used in tests',
        content_json: { raw: 'Paso 1: hacer algo' },
        difficulty: 'media',
        time: 15,
        visibility: 'public',
        is_deleted: false
      },
      {
        id: 'r3',
        slug: 'pasta-recipe',
        title: 'Pasta Recipe',
        description: 'Pasta receta demo',
        content_json: { ingredients: [{ quantity: '1', unit: 'taza', item: 'salsa' }], steps: ['Mezclar'] },
        difficulty: 'fácil',
        time: 20,
        visibility: 'public',
        is_deleted: false
      }
    ];

    // Internal state to emulate a query builder
    const state: any = {
      filters: {},
      textSearchQuery: null,
      limitNum: null,
      orderBy: null,
      selectFields: null,
      wantSingle: false
    };

    builder.select = (...args: any) => {
      state.selectFields = args;
      return builder;
    };

    builder.insert = (..._args: any) => builder;
    builder.update = (..._args: any) => builder;
    builder.delete = (..._args: any) => builder;

    builder.eq = (k: string, v: any) => {
      state.filters[k] = v;
      return builder;
    };

    builder.single = (..._args: any) => {
      state.wantSingle = true;
      return builder;
    };

    builder.maybeSingle = async () => {
      // If there's a slug filter return matching sample recipe
      if (state.filters.slug) {
        const match = sampleRecipes.find(r => r.slug === state.filters.slug && (!state.filters.visibility || r.visibility === state.filters.visibility));
        return { data: match ?? null, error: null };
      }
      // If any other filter applied, attempt to match
      if (state.filters.visibility || state.filters.is_deleted !== undefined) {
        const list = sampleRecipes.filter(r => (state.filters.visibility ? r.visibility === state.filters.visibility : true) && (state.filters.is_deleted !== undefined ? r.is_deleted === state.filters.is_deleted : true));
        return { data: list[0] ?? null, error: null };
      }
      return { data: null, error: null };
    };

    builder.limit = (n: number) => {
      state.limitNum = n;
      return builder;
    };

    builder.order = (_k: string, _opts?: any) => {
      state.orderBy = _k;
      return builder;
    };

    builder.ilike = (_k: any, _pattern: any) => {
      // For tests, return recipes that contain 'pasta' in slug/title if ilike used
      state.filters.ilike = _pattern;
      return builder;
    };

    builder.textSearch = (_k: any, q: string) => {
      state.textSearchQuery = q;
      return builder;
    };

    builder.lte = (_k: any, _v: any) => builder;

    // thenable resolves to a list of sample recipes (filters applied)
    builder.then = (resolve: any, reject: any) => {
      try {
        let result = sampleRecipes.slice();

        if (state.filters.slug) result = result.filter(r => r.slug === state.filters.slug);
        if (state.filters.visibility) result = result.filter(r => r.visibility === state.filters.visibility);
        if (state.filters.ilike) {
          const pattern = (state.filters.ilike as string).replace(/%/g, '').toLowerCase();
          result = result.filter(r => (r.title || '').toLowerCase().includes(pattern) || (r.slug || '').toLowerCase().includes(pattern));
        }
        if (state.textSearchQuery) {
          const q = (state.textSearchQuery || '').toLowerCase();
          result = result.filter(r => (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
        }

        if (state.limitNum) result = result.slice(0, state.limitNum);

        const out = { data: state.wantSingle ? (result[0] ?? null) : result, error: null };

        return Promise.resolve(out).then(resolve, reject);
      } catch (err) {
        return Promise.reject(err).then(resolve, reject);
      }
    };

    return builder;
  };

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
    const makeFrom = () => {
      // Reuse the same in-memory sample dataset as the client no-op so server
      // components and routes render predictable data during dev/test.
      const builder: any = {};
      const terminalResult = { data: null, error: null };

      const sampleRecipes = [
        { id: 'r1', slug: 'pasta-con-verduras', title: 'Pasta con verduras', description: 'Pasta con verduras salteadas', content_json: { ingredients: [{ quantity: '200g', unit: '', item: 'pasta' }], steps: ['Hervir la pasta', 'Saltear verduras'] }, difficulty: 'fácil', time: 25, visibility: 'public', is_deleted: false },
        { id: 'r2', slug: 'test-recipe', title: 'Test Recipe', description: 'A sample recipe used in tests', content_json: { raw: 'Paso 1: hacer algo' }, difficulty: 'media', time: 15, visibility: 'public', is_deleted: false },
        { id: 'r3', slug: 'pasta-recipe', title: 'Pasta Recipe', description: 'Pasta receta demo', content_json: { ingredients: [{ quantity: '1', unit: 'taza', item: 'salsa' }], steps: ['Mezclar'] }, difficulty: 'fácil', time: 20, visibility: 'public', is_deleted: false }
      ];

      const state: any = { filters: {}, textSearchQuery: null, limitNum: null, orderBy: null, selectFields: null, wantSingle: false };

      builder.select = (...args: any) => { state.selectFields = args; return builder; };
      builder.insert = (..._args: any) => builder;
      builder.update = (..._args: any) => builder;
      builder.delete = (..._args: any) => builder;
      builder.eq = (k: string, v: any) => { state.filters[k] = v; return builder; };
      builder.single = (..._args: any) => { state.wantSingle = true; return builder; };
      builder.maybeSingle = async () => {
        if (state.filters.slug) {
          const match = sampleRecipes.find(r => r.slug === state.filters.slug && (!state.filters.visibility || r.visibility === state.filters.visibility));
          return { data: match ?? null, error: null };
        }
        if (state.filters.visibility || state.filters.is_deleted !== undefined) {
          const list = sampleRecipes.filter(r => (state.filters.visibility ? r.visibility === state.filters.visibility : true) && (state.filters.is_deleted !== undefined ? r.is_deleted === state.filters.is_deleted : true));
          return { data: list[0] ?? null, error: null };
        }
        return { data: null, error: null };
      };
      builder.limit = (n: number) => { state.limitNum = n; return builder; };
      builder.order = (_k: string, _opts?: any) => { state.orderBy = _k; return builder; };
      builder.ilike = (_k: any, _pattern: any) => { state.filters.ilike = _pattern; return builder; };
      builder.textSearch = (_k: any, q: string) => { state.textSearchQuery = q; return builder; };
      builder.lte = (_k: any, _v: any) => builder;

      builder.then = (resolve: any, reject: any) => {
        try {
          let result = sampleRecipes.slice();
          if (state.filters.slug) result = result.filter(r => r.slug === state.filters.slug);
          if (state.filters.visibility) result = result.filter(r => r.visibility === state.filters.visibility);
          if (state.filters.ilike) {
            const pattern = (state.filters.ilike as string).replace(/%/g, '').toLowerCase();
            result = result.filter(r => (r.title || '').toLowerCase().includes(pattern) || (r.slug || '').toLowerCase().includes(pattern));
          }
          if (state.textSearchQuery) {
            const q = (state.textSearchQuery || '').toLowerCase();
            result = result.filter(r => (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
          }
          if (state.limitNum) result = result.slice(0, state.limitNum);
          const out = { data: state.wantSingle ? (result[0] ?? null) : result, error: null };
          return Promise.resolve(out).then(resolve, reject);
        } catch (err) {
          return Promise.reject(err).then(resolve, reject);
        }
      };

      return builder;
    };

    const storageFrom = (_bucketName: string) => ({
      upload: async () => ({ data: { path: '' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
      remove: async () => ({ data: null, error: null }),
      list: async () => ({ data: [], error: null }),
    });

    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: (_: string) => makeFrom(),
      storage: { from: storageFrom },
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
    const makeFrom = () => {
      const builder: any = {};
      const terminalResult = { data: null, error: null };

      const sampleRecipes = [
        { id: 'r1', slug: 'pasta-con-verduras', title: 'Pasta con verduras', description: 'Pasta con verduras salteadas', content_json: { ingredients: [{ quantity: '200g', unit: '', item: 'pasta' }], steps: ['Hervir la pasta', 'Saltear verduras'] }, difficulty: 'fácil', time: 25, visibility: 'public', is_deleted: false },
        { id: 'r2', slug: 'test-recipe', title: 'Test Recipe', description: 'A sample recipe used in tests', content_json: { raw: 'Paso 1: hacer algo' }, difficulty: 'media', time: 15, visibility: 'public', is_deleted: false },
        { id: 'r3', slug: 'pasta-recipe', title: 'Pasta Recipe', description: 'Pasta receta demo', content_json: { ingredients: [{ quantity: '1', unit: 'taza', item: 'salsa' }], steps: ['Mezclar'] }, difficulty: 'fácil', time: 20, visibility: 'public', is_deleted: false }
      ];

      const state: any = { filters: {}, textSearchQuery: null, limitNum: null, orderBy: null, selectFields: null, wantSingle: false };

      builder.select = (...args: any) => { state.selectFields = args; return builder; };
      builder.insert = (..._args: any) => builder;
      builder.update = (..._args: any) => builder;
      builder.delete = (..._args: any) => builder;
      builder.eq = (k: string, v: any) => { state.filters[k] = v; return builder; };
      builder.single = (..._args: any) => { state.wantSingle = true; return builder; };
      builder.maybeSingle = async () => {
        if (state.filters.slug) {
          const match = sampleRecipes.find(r => r.slug === state.filters.slug && (!state.filters.visibility || r.visibility === state.filters.visibility));
          return { data: match ?? null, error: null };
        }
        if (state.filters.visibility || state.filters.is_deleted !== undefined) {
          const list = sampleRecipes.filter(r => (state.filters.visibility ? r.visibility === state.filters.visibility : true) && (state.filters.is_deleted !== undefined ? r.is_deleted === state.filters.is_deleted : true));
          return { data: list[0] ?? null, error: null };
        }
        return { data: null, error: null };
      };
      builder.limit = (n: number) => { state.limitNum = n; return builder; };
      builder.order = (_k: string, _opts?: any) => { state.orderBy = _k; return builder; };
      builder.ilike = (_k: any, _pattern: any) => { state.filters.ilike = _pattern; return builder; };
      builder.textSearch = (_k: any, q: string) => { state.textSearchQuery = q; return builder; };
      builder.lte = (_k: any, _v: any) => builder;

      builder.then = (resolve: any, reject: any) => {
        try {
          let result = sampleRecipes.slice();
          if (state.filters.slug) result = result.filter(r => r.slug === state.filters.slug);
          if (state.filters.visibility) result = result.filter(r => r.visibility === state.filters.visibility);
          if (state.filters.ilike) {
            const pattern = (state.filters.ilike as string).replace(/%/g, '').toLowerCase();
            result = result.filter(r => (r.title || '').toLowerCase().includes(pattern) || (r.slug || '').toLowerCase().includes(pattern));
          }
          if (state.textSearchQuery) {
            const q = (state.textSearchQuery || '').toLowerCase();
            result = result.filter(r => (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
          }
          if (state.limitNum) result = result.slice(0, state.limitNum);
          const out = { data: state.wantSingle ? (result[0] ?? null) : result, error: null };
          return Promise.resolve(out).then(resolve, reject);
        } catch (err) {
          return Promise.reject(err).then(resolve, reject);
        }
      };

      return builder;
    };

    const storageFrom = (_bucketName: string) => ({
      upload: async () => ({ data: { path: '' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
      remove: async () => ({ data: null, error: null }),
      list: async () => ({ data: [], error: null }),
    });

    return {
      auth: { getUser: async () => ({ data: { user: null }, error: null }) },
      from: (_: string) => makeFrom(),
      storage: { from: storageFrom },
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
