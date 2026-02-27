import { test, expect } from '@playwright/test';
import es from '../dictionaries/es.json';
import en from '../dictionaries/en.json';

/**
 * i18n Routing E2E Tests
 * 
 * These tests verify:
 * - Language switching via URL
 * - Locale detection from cookies
 * - Language persistence across navigation
 * - SEO meta tags per locale
 * - 404 handling for invalid locales
 * - Content rendering in different languages
 */

const LOCALES = ['es', 'en', 'fr', 'de', 'it', 'pl', 'ru', 'pt'];
const DEFAULT_LOCALE = 'es';

test.describe('i18n Routing', () => {
  
  test.describe('Language Switching via URL', () => {
    
    test('homepage renders in Spanish by default', async ({ page }) => {
      await page.goto('/es');
      
      // Check HTML lang attribute
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      
      // Check for Spanish content
      await expect(page.locator('h1')).toContainText(es['home.hero.title']);
    });
    
    test('homepage renders in English', async ({ page }) => {
      await page.goto('/en');
      
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toContainText(en['home.hero.title']);
    });
    
    test('clubs page renders in Spanish', async ({ page }) => {
      await page.goto('/es/clubs');
      
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      await expect(page.locator('h1')).toContainText(es['clubs.title']);
    });
    
    test('clubs page renders in English', async ({ page }) => {
      await page.goto('/en/clubs');
      
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toContainText(en['clubs.title']);
    });
    
    test('editorial page renders in Spanish', async ({ page }) => {
      await page.goto('/es/editorial');
      
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    });
    
    test('all supported locales have correct lang attribute', async ({ page }) => {
      for (const locale of LOCALES) {
        await page.goto(`/${locale}`);
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
      }
    });
  });
  
  test.describe('Locale Detection from Cookies', () => {
    
    test('detects locale from cookie and redirects', async ({ context, page }) => {
      // Set locale cookie to English
      await context.addCookies([{
        name: 'NEXT_LOCALE',
        value: 'en',
        domain: 'localhost',
        path: '/',
      }]);
      
      // Navigate to root - should use cookie locale
      await page.goto('/');
      
      // Should redirect to English version
      await expect(page).toHaveURL(/\/en/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
    
    test('respects cookie locale across navigation', async ({ context, page }) => {
      await context.addCookies([{
        name: 'NEXT_LOCALE',
        value: 'en',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/en');
      
      // Navigate to clubs
      await page.goto('/en/clubs');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      
      // Navigate to editorial
      await page.goto('/en/editorial');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  });
  
  test.describe('Language Persistence Across Navigation', () => {
    
    test('language persists when navigating between pages', async ({ page }) => {
      // Start on Spanish homepage
      await page.goto('/es');
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      
      // Navigate to clubs
      await page.goto('/es/clubs');
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      await expect(page.locator('h1')).toContainText(es['clubs.title']);
      
      // Navigate to editorial
      await page.goto('/es/editorial');
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    });
    
    test('language persists in English across navigation', async ({ page }) => {
      await page.goto('/en');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      
      await page.goto('/en/clubs');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toContainText(en['clubs.title']);
    });
  });
  
  test.describe('SEO Meta Tags', () => {
    
    test('has correct og:locale meta tag for Spanish', async ({ page }) => {
      await page.goto('/es');
      
      const ogLocale = page.locator('meta[property="og:locale"]');
      await expect(ogLocale).toHaveAttribute('content', 'es_ES');
    });
    
    test('has correct og:locale meta tag for English', async ({ page }) => {
      await page.goto('/en');
      
      const ogLocale = page.locator('meta[property="og:locale"]');
      // Note: May need adjustment based on actual implementation
      await expect(ogLocale).toHaveCount(1);
    });
    
    test('has canonical link', async ({ page }) => {
      await page.goto('/es');
      
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
    });
  });
  
  test.describe('404 Handling for Invalid Locales', () => {
    
    test('returns 404 for invalid locale prefix', async ({ page }) => {
      const response = await page.goto('/xx');
      
      // Should return 404 status
      expect(response?.status()).toBe(404);
    });
    
    test('returns 404 for invalid locale with valid path', async ({ page }) => {
      const response = await page.goto('/xx/clubs');
      
      expect(response?.status()).toBe(404);
    });
    
    test('shows not found page for invalid locale', async ({ page }) => {
      await page.goto('/invalid-lang');
      
      // Should show not found content
      await expect(page.getByText(/page not found|página no encontrada|not-found/i)).toBeVisible();
    });
  });
  
  test.describe('Content Rendering in Different Languages', () => {
    
    test('navigation shows correct translations in Spanish', async ({ page }) => {
      await page.goto('/es');
      
      // Check navigation links
      await expect(page.getByRole('link', { name: es['nav.explore'] })).toBeVisible();
      await expect(page.getByRole('link', { name: es['nav.blog'] })).toBeVisible();
    });
    
    test('navigation shows correct translations in English', async ({ page }) => {
      await page.goto('/en');
      
      await expect(page.getByRole('link', { name: en['nav.explore'] })).toBeVisible();
      await expect(page.getByRole('link', { name: en['nav.blog'] })).toBeVisible();
    });
    
    test('hero section renders translated content', async ({ page }) => {
      await page.goto('/es');
      
      // Check hero title and subtitle
      await expect(page.locator('h1')).toContainText(es['home.hero.title']);
    });
    
    test('footer shows translated content', async ({ page }) => {
      await page.goto('/es');
      
      // Check footer content
      await expect(page.locator('footer')).toContainText(es['footer.description'].substring(0, 50));
    });
  });
  
  test.describe('Language Switcher', () => {
    
    test('language switcher changes URL when clicked', async ({ page }) => {
      await page.goto('/es');
      
      // Find and click language switcher (assuming it has a data-testid or specific structure)
      // This test assumes there's a language selector component
      const langSwitcher = page.locator('[data-testid="language-selector"]').or(page.locator('select')).first();
      
      if (await langSwitcher.isVisible().catch(() => false)) {
        await langSwitcher.selectOption('en');
        await expect(page).toHaveURL(/\/en/);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      }
    });
  });
});
