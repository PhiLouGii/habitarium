const { test, expect } = require('@playwright/test');

test('User can login and see dashboard', async ({ page }) => {
  await page.goto('https://habitarium-webapp.azurewebsites.net');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'validpassword');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveText('h1', 'Your Habits Dashboard');
});