// Export users to dev-output/users-<timestamp>.json
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE || '';

async function main() {
  if (!url || !service) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE');
    process.exit(1);
  }
  const supabase = createClient(url, service);

  // Try admin API to list users (auth schema)
  let users: any[] = [];
  try {
    let page = 1;
    const perPage = 1000;
    // @ts-ignore - admin listUsers exists in supabase-js v2
    while (true) {
      // @ts-ignore
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      if (!data?.users?.length) break;
      users.push(...data.users);
      if (data.users.length < perPage) break;
      page++;
    }
  } catch (e) {
    console.warn('Falling back to user_profiles only:', (e as any)?.message);
  }

  // Join with profiles if possible
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id,email,plan,role,metadata,created_at,updated_at');
  const profilesMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

  const out = users.length
    ? users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        phone: u.phone,
        app_metadata: u.app_metadata,
        user_metadata: u.user_metadata,
        profile: profilesMap.get(u.id) || null,
      }))
    : (profiles || []);

  const dir = path.join(process.cwd(), 'dev-output');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `users-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
  console.log('Exported', out.length, 'records to', file);
}

main().catch(err => { console.error(err); process.exit(1); });
