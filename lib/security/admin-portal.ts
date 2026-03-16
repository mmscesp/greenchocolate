import { revalidatePath } from 'next/cache';

const adminLocales = ['en', 'es', 'fr', 'de'] as const;
const adminPathPattern = new RegExp(`^\\/(?:${adminLocales.join('|')})\\/admin(?:\\/.*)?$`);

export function getSafeAdminReturnPath(
  candidate: FormDataEntryValue | null,
  fallbackPath: string
): string {
  if (typeof candidate !== 'string' || candidate.length === 0) {
    return fallbackPath;
  }

  try {
    const url = new URL(candidate, 'http://localhost');
    const safePath = `${url.pathname}${url.search}`;
    return adminPathPattern.test(url.pathname) ? safePath : fallbackPath;
  } catch {
    return fallbackPath;
  }
}

export function withAdminActionStatus(
  path: string,
  status: 'success' | 'error',
  message: string
): string {
  const url = new URL(path, 'http://localhost');
  url.searchParams.set('status', status);
  url.searchParams.set('message', message);
  return `${url.pathname}${url.search}`;
}

export function revalidateAdminPortalPaths(paths: string[]): void {
  for (const locale of adminLocales) {
    for (const path of paths) {
      revalidatePath(`/${locale}/admin${path}`);
    }
  }
}
