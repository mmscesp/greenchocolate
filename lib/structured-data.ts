import { toAbsoluteUrl } from '@/lib/seo';

export function toSchemaImageUrl(src: string | null | undefined): string | undefined {
  if (!src) {
    return undefined;
  }

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  return toAbsoluteUrl(src.startsWith('/') ? src : `/${src}`);
}

export function withoutUndefinedValues<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)) as T;
}
