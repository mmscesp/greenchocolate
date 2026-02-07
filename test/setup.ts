import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Test Setup File
 * Phase 2: Safety & Stability - Testing Configuration
 */

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
