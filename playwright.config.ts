import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    // Prefer 127.0.0.1 to avoid localhost resolving to IPv6 (::1) on some environments
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // In CI we start the dev server; locally prefer reusing an already-running instance
  webServer: process.env.CI
    ? {
        command: 'npm run dev',
        url: 'http://127.0.0.1:3000',
        // allow more time for the dev server to become responsive in noisy CI/dev machines
        timeout: 120000,
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
});