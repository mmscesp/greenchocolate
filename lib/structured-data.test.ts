import { describe, expect, it } from 'vitest';
import { toSchemaImageUrl, withoutUndefinedValues } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/seo';

describe('structured data helpers', () => {
  it('converts internal image paths to absolute URLs', () => {
    expect(toSchemaImageUrl('/images/example.webp')).toBe(`${getBaseUrl()}/images/example.webp`);
  });

  it('keeps absolute URLs unchanged', () => {
    expect(toSchemaImageUrl('https://cdn.example.com/image.webp')).toBe('https://cdn.example.com/image.webp');
  });

  it('removes undefined values without removing false or null', () => {
    expect(withoutUndefinedValues({ a: undefined, b: null, c: false, d: 'value' })).toEqual({
      b: null,
      c: false,
      d: 'value',
    });
  });
});
