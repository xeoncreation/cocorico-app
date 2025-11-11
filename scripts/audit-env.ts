// Audit critical environment variables for Cocorico
// Run with: npx ts-node scripts/audit-env.ts (ensure ts-node installed)

import 'dotenv/config';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'REPLICATE_API_TOKEN',
  'SITE_PASSWORD',
  'ADMIN_SECRET'
];

const missing = required.filter(k => !process.env[k]);

console.log('Env audit (loaded .env.local if present):');
required.forEach(k => {
  console.log(`${k}: ${process.env[k] ? 'OK' : 'MISSING'}`);
});

if (missing.length) {
  console.error('\nMissing variables:', missing.join(', '));
  process.exitCode = 1;
} else {
  console.log('\nAll required environment variables present.');
}
