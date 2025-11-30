import { defineConfig, devices } from '@playwright/test';

// Disable analytics during Playwright runs to reduce CSP/console noise and avoid
// loading external tracking scripts (Umami / gtag) while running tests.
process.env.NEXT_PUBLIC_DISABLE_ANALYTICS = process.env.NEXT_PUBLIC_DISABLE_ANALYTICS || '1';

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
        // Start the dev server in CI with analytics disabled to avoid loading
        // tracking scripts during test runs. 'dev:127' binds on 127.0.0.1:3000.
        command: 'cross-env NEXT_PUBLIC_DISABLE_ANALYTICS=1 npm run dev:127',
        url: 'http://127.0.0.1:3000',
        // allow more time for the dev server to become responsive in noisy CI/dev machines
        timeout: 120000,
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
});