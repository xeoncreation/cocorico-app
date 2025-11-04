import { test, expect } from '@playwright/test';

test('auth flow', async ({ page }) => {
  // Start from homepage
  await page.goto('http://localhost:3000');
  
  // Should show login button when not authenticated
  const loginButton = await page.getByText('Iniciar sesión por email');
  await expect(loginButton).toBeVisible();
  
  // Callback page should show loading state
  await page.goto('http://localhost:3000/auth/callback');
  const loadingText = await page.getByText('Finalizando autenticación');
  await expect(loadingText).toBeVisible();
  
  // Should redirect to home after timeout
  await page.waitForURL('http://localhost:3000/', { timeout: 3000 });
});

test('chat endpoint', async ({ request }) => {
  const response = await request.post('http://localhost:3000/api/chat', {
    data: { message: 'test message' }
  });
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data).toHaveProperty('answer');
});