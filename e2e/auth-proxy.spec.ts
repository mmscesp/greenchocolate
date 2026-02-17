import { test, expect } from '@playwright/test';

test.describe('Proxy Route Protection', () => {
  test('redirects unauthenticated user from protected profile route', async ({ page }) => {
    await page.goto('/en/profile');

    await expect(page).toHaveURL(/\/en\/account\/login\?redirect=%2Fprofile/);
  });

  test('redirects unauthenticated user from club dashboard route', async ({ page }) => {
    await page.goto('/en/club-panel/dashboard');

    await expect(page).toHaveURL(/\/en\/club-panel\/login\?redirect=%2Fclub-panel%2Fdashboard/);
  });
});
