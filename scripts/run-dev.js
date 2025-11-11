// Small launcher to toggle Next.js config flags via env and run dev server
// Usage:
//  node scripts/run-dev.js --no-pwa
//  node scripts/run-dev.js --no-intl
//  node scripts/run-dev.js --minimal

const { spawn } = require('child_process');

const args = process.argv.slice(2);
const env = { ...process.env };

if (args.includes('--no-pwa')) env.DISABLE_PWA = '1';
if (args.includes('--no-intl')) env.DISABLE_INTL = '1';
if (args.includes('--minimal')) env.MINIMAL_NEXT_CONFIG = '1';

// Default host/port (keep consistent with package.json)
const nextArgs = ['dev', '-p', process.env.PORT || '3000'];

// Use npx next dev directly to avoid module loading issues
const child = spawn('npx', ['next', ...nextArgs], {
  stdio: 'inherit',
  env,
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
