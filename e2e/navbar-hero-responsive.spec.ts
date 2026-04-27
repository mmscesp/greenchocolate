import { test, expect } from '@playwright/test';

const locales = ['es', 'fr', 'de'] as const;

function isOverlapping(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

for (const locale of locales) {
  test(`desktop navbar + hero CTA layout remains stable in ${locale}`, async ({ page }) => {
    test.skip(page.viewportSize()?.width ? page.viewportSize()!.width < 768 : false, 'Desktop-only hero assertion');

    await page.setViewportSize({ width: 1220, height: 860 });
    await page.goto(`/${locale}`);

    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    await expect(nav.getByText('Safety Kit')).toBeVisible();

    const navFits = await nav.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
    expect(navFits).toBeTruthy();

    // Desktop CTA group intentionally fades in during the scroll-driven Act 2 sequence.
    await page.evaluate(() => {
      window.scrollTo({ top: Math.round(window.innerHeight * 0.85), behavior: 'instant' });
    });

    const ctaGroup = page.getByTestId('hero-desktop-cta-group');
    await expect(ctaGroup).toBeVisible({ timeout: 10000 });

    const ctaLinks = ctaGroup.locator('a');
    await expect(ctaLinks).toHaveCount(2);

    const firstCtaBox = await ctaLinks.nth(0).boundingBox();
    const secondCtaBox = await ctaLinks.nth(1).boundingBox();

    expect(firstCtaBox).not.toBeNull();
    expect(secondCtaBox).not.toBeNull();

    const overlap = isOverlapping(firstCtaBox!, secondCtaBox!);
    expect(overlap).toBeFalsy();
  });
}
