const { test, expect } = require('@playwright/test');

test('Basic health check', async ({ page }) => {
  const response = await page.goto('https://your-staging-url.azurewebsites.net/api/health');
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body.status).toBe('OK');
});