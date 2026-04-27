import { expect, test, type Page } from '@playwright/test';

async function installAnalyticsCollector(page: Page) {
  await page.addInitScript(() => {
    (window as Window & { __scmAnalyticsEvents?: Array<Record<string, unknown>> }).__scmAnalyticsEvents = [];

    window.addEventListener('scm:analytics', ((event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      const analyticsWindow = window as Window & {
        __scmAnalyticsEvents: Array<Record<string, unknown>>;
      };

      analyticsWindow.__scmAnalyticsEvents.push(customEvent.detail);
    }) as EventListener);
  });
}

async function primeLegalConsent(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('legal_consent_v1', 'true');
  });
}

async function getAnalyticsEvents(page: Page) {
  return page.evaluate(() => {
    const analyticsWindow = window as Window & {
      __scmAnalyticsEvents?: Array<Record<string, unknown>>;
    };

    return analyticsWindow.__scmAnalyticsEvents ?? [];
  });
}

test.describe('Safety Kit funnel', () => {
  test('renders both funnel placements with locale-aware links', async ({ page }) => {
    await primeLegalConsent(page);
    await page.goto('/en/safety-kit');

    await expect(page.getByTestId('safety-kit-funnel-hero')).toBeVisible();
    await expect(page.getByTestId('safety-kit-funnel-final_cta')).toBeVisible();

    await expect(page.getByTestId('safety-kit-open-guide-hero')).toHaveAttribute(
      'href',
      '/en/editorial/safety-kit-visitors-spain'
    );
    await expect(page.getByTestId('safety-kit-open-guide-final_cta')).toHaveAttribute(
      'href',
      '/en/editorial/safety-kit-visitors-spain'
    );
  });

  test('starts on age gate and reaches download after adult confirmation', async ({ page }) => {
    await primeLegalConsent(page);
    await installAnalyticsCollector(page);
    await page.goto('/en/safety-kit');

    await expect(page.getByTestId('safety-kit-age-yes-hero')).toBeVisible();
    await page.getByTestId('safety-kit-age-yes-hero').click();
    await expect(page.getByTestId('safety-kit-download-pdf-hero')).toBeVisible();
    await expect(page.getByTestId('safety-kit-newsletter-email-hero')).toBeVisible();

    const events = await getAnalyticsEvents(page);
    const eventNames = events.map((event) => event.event);

    expect(eventNames).toContain('safety_kit_funnel_view');
    expect(eventNames).toContain('safety_kit_funnel_age_gate_view');
    expect(eventNames).toContain('safety_kit_funnel_age_gate_accept');
    expect(eventNames).toContain('safety_kit_funnel_success_view');

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: 'safety_kit_funnel_view',
          placement: 'hero',
          locale: 'en',
        }),
      ])
    );
  });

  test('supports the reject and reset path without leaving the page', async ({ page }) => {
    await primeLegalConsent(page);
    await installAnalyticsCollector(page);
    await page.goto('/en/safety-kit');

    await page.getByTestId('safety-kit-age-no-final_cta').click();

    await expect(page.getByTestId('safety-kit-reset-final_cta')).toBeVisible();

    const rejectedEvents = await getAnalyticsEvents(page);
    expect(rejectedEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: 'safety_kit_funnel_age_gate_reject',
          placement: 'final_cta',
          locale: 'en',
        }),
      ])
    );

    await page.getByTestId('safety-kit-reset-final_cta').click();
    await expect(page.getByTestId('safety-kit-age-yes-final_cta')).toBeVisible();

    const resetEvents = await getAnalyticsEvents(page);
    expect(resetEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: 'safety_kit_funnel_reset',
          placement: 'final_cta',
          locale: 'en',
        }),
      ])
    );
  });
});
