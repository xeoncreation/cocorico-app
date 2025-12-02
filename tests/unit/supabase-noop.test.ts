import { createClientComponentClient } from '@/lib/supabase/client';

describe('Supabase no-op client', () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeAll(() => {
    // Ensure env vars are unset so the function returns the noop client
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterAll(() => {
    // Restore original environment
    if (originalUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalKey !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
  });

  test('returns a safe object with expected surfaces', async () => {
    const client: any = createClientComponentClient();

    expect(client).toBeTruthy();
    // auth surface
    expect(typeof client.auth?.getUser).toBe('function');
    const userRes = await client.auth.getUser();
    expect(userRes).toHaveProperty('data');

    // from() chainable
    expect(typeof client.from).toBe('function');
    const maybe = await client.from('recipes').eq('slug', 'pasta-con-verduras').maybeSingle();
    expect(maybe).toHaveProperty('data');

    // storage
    expect(client.storage).toBeTruthy();
    const storage = client.storage.from('assets');
    expect(typeof storage.upload).toBe('function');

    // rpc & functions
    expect(typeof client.rpc).toBe('function');
    expect(typeof client.functions.invoke).toBe('function');
  });
});
