import { spawn } from 'child_process';

const server = spawn('npx', ['cross-env', 'NEXT_PUBLIC_DISABLE_ANALYTICS=1', 'NEXT_DIST_DIR=.next-debug', 'next', 'dev', '-H', '127.0.0.1', '-p', '3050'], {
  cwd: process.cwd(),
  env: { ...process.env },
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
});

let ready = false;

function handleReadyLine(line: string) {
  if (ready) return;
  if (line.includes('Ready')) {
    ready = true;
    setTimeout(runCheck, 1000);
  }
}

server.stdout.on('data', chunk => {
  const text = chunk.toString();
  process.stdout.write(text);
  handleReadyLine(text);
});

server.stderr.on('data', chunk => {
  process.stderr.write(chunk);
});

server.on('close', code => {
  console.log(`dev server exited with code ${code}`);
  process.exit(code ?? 0);
});

async function runCheck() {
  try {
    const res = await fetch('http://127.0.0.1:3050/r/public/test-recipe');
    const body = await res.text();
    console.log('Response status:', res.status);
    console.log('Body preview:', body.slice(0, 400));
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    server.kill();
  }
}
