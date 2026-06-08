import { expect, test, type Page } from '@playwright/test';

async function primeLegalConsent(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('legal_consent_v1', 'true');
    window.localStorage.setItem(
      'scm.cookie_consent.v1',
      JSON.stringify({
        version: '2026-05-12',
        updatedAt: '2026-05-12T00:00:00.000Z',
        categories: {
          necessary: true,
          functional: false,
          measurement: true,
          marketing: false,
        },
      })
    );
  });
}

test.describe('club directory map', () => {
  test('renders OpenStreetMap map mode and opens a club preview', async ({ page }) => {
    await primeLegalConsent(page);
    await page.goto('/en/spain/barcelona/clubs');

    await page.getByRole('button', { name: /^map$/i }).click();

    await expect(page.getByLabel(/club directory map/i)).toBeVisible();
    await expect(page.getByText(/OpenStreetMap/i)).toBeVisible();
    await expect(page.getByText(/reviewed address-level locations/i)).toBeVisible();

    const marker = page.getByRole('button', { name: /Club 311 Barcelona/i }).first();
    await expect(marker).toBeVisible();
    await marker.dispatchEvent('click');

    await expect(page.getByRole('heading', { name: /Club 311 Barcelona/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view profile/i })).toBeVisible();
  });

  test('keeps the map usable on mobile width', async ({ page }) => {
    await primeLegalConsent(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/spain/barcelona/clubs');

    await page.getByRole('button', { name: /^map$/i }).click();

    await expect(page.getByLabel(/club directory map/i)).toBeVisible();
    await expect(page.getByText(/OpenStreetMap/i)).toBeVisible();
  });
});
