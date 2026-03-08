import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Test Setup File
 * Phase 2: Safety & Stability - Testing Configuration
 */

process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= 'anon-key';
process.env.NEXT_PUBLIC_APP_URL ??= 'https://example.com';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/test';
process.env.APP_MASTER_KEY ??= 'test-master-key';
process.env.ENCRYPTION_SALT ??= 'test-encryption-salt-1234';
process.env.NODE_ENV ??= 'test';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: () => ({
    get: vi.fn(),
  }),
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Suppress console errors during tests (optional)
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  // Filter out expected errors during testing
  const message = args[0]?.toString() || '';
  if (
    message.includes('Warning: ReactDOM.render') ||
    message.includes('Warning: useLayoutEffect')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
