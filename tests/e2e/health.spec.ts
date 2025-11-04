import { test, expect } from '@playwright/test';

// Simple smoke test to ensure the server is up and responding
// before running deeper navigation checks.

test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.status).toBe('ok');
});
