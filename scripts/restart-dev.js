#!/usr/bin/env node
/*
 * restart-dev.js
 * Kills port 3000 and starts the dev server in a detached child process.
 * Cross-platform helper so `npm run dev:restart` won't block the calling shell.
 */

const { execSync, spawn } = require('child_process');

function killPort(port = 3000) {
  try {
    // Use npx kill-port (installed as a dev tool at runtime)
    execSync(`npx kill-port ${port}`, { stdio: 'inherit' });
    console.log(`Port ${port} freed (if it was in use).`);
  } catch (err) {
    console.warn('kill-port returned non-zero (might be already free):', err?.message || err);
  }
}

function startDetachedNpm(script = 'dev:127') {
  if (process.platform === 'win32') {
    // Use cmd.exe start to launch a detached process on Windows which returns immediately
    // 'start' requires a title for the new window, provide an empty string.
    const child = spawn('cmd.exe', ['/c', 'start', '""', 'npm', 'run', script], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    child.unref();
    console.log(`Started detached process (cmd start) for npm run ${script}`);
  } else {
    const child = spawn('npm', ['run', script], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    console.log(`Started detached process PID=${child.pid} for npm run ${script}`);
  }
}

(async () => {
  killPort(3000);
  // Short pause so the port has time to release
  await new Promise((r) => setTimeout(r, 250));
  startDetachedNpm('dev:127');
})();
