import { describe, expect, it } from 'vitest';
import {
  CANONICAL_DIRECTORY_PATH,
  getCityIndexPolicy,
  getRouteIndexPolicy,
  isCanonicalDirectoryPath,
  shouldIncludeInSitemap,
} from '@/lib/seo-policy';

describe('seo policy', () => {
  it('uses Barcelona city clubs as the canonical directory path', () => {
    expect(CANONICAL_DIRECTORY_PATH).toBe('/spain/barcelona/clubs');
    expect(isCanonicalDirectoryPath('/spain/barcelona/clubs')).toBe(true);
    expect(isCanonicalDirectoryPath('/clubs')).toBe(false);
  });

  it('keeps Barcelona city pages indexable and non-Barcelona city pages noindex follow', () => {
    expect(getCityIndexPolicy('barcelona')).toEqual({ index: true, follow: true });
    expect(getCityIndexPolicy('madrid')).toEqual({ index: false, follow: true });
    expect(getCityIndexPolicy('valencia')).toEqual({ index: false, follow: true });
  });

  it('keeps private and account route families out of sitemap', () => {
    expect(shouldIncludeInSitemap('/profile')).toBe(false);
    expect(shouldIncludeInSitemap('/account/login')).toBe(false);
    expect(shouldIncludeInSitemap('/admin')).toBe(false);
    expect(shouldIncludeInSitemap('/club-panel/dashboard')).toBe(false);
  });

  it('keeps event surfaces noindex by default', () => {
    expect(getRouteIndexPolicy('/events')).toEqual({ index: false, follow: true });
    expect(getRouteIndexPolicy('/events/spannabis-bilbao-2026')).toEqual({ index: false, follow: true });
    expect(shouldIncludeInSitemap('/events')).toBe(false);
  });

  it('keeps core public trust pages indexable', () => {
    expect(getRouteIndexPolicy('/')).toEqual({ index: true, follow: true });
    expect(getRouteIndexPolicy('/safety-kit')).toEqual({ index: true, follow: true });
    expect(getRouteIndexPolicy('/verification')).toEqual({ index: true, follow: true });
    expect(getRouteIndexPolicy('/editorial/legal')).toEqual({ index: true, follow: true });
    expect(getRouteIndexPolicy('/spain/barcelona')).toEqual({ index: true, follow: true });
  });

  it('noindexes nested non-Barcelona city route families', () => {
    expect(getRouteIndexPolicy('/spain/madrid/clubs')).toEqual({ index: false, follow: true });
    expect(getRouteIndexPolicy('/spain/madrid/guides')).toEqual({ index: false, follow: true });
    expect(getRouteIndexPolicy('/spain/barcelona/clubs')).toEqual({ index: true, follow: true });
    expect(getRouteIndexPolicy('/spain/barcelona/guides')).toEqual({ index: true, follow: true });
  });

  it('excludes redirect, noindex, and private routes from sitemap eligibility', () => {
    expect(shouldIncludeInSitemap('/clubs')).toBe(false);
    expect(shouldIncludeInSitemap('/events/spannabis-bilbao-2026')).toBe(false);
    expect(shouldIncludeInSitemap('/spain/madrid')).toBe(false);
    expect(shouldIncludeInSitemap('/spain/madrid/clubs')).toBe(false);
    expect(shouldIncludeInSitemap('/spain/barcelona')).toBe(true);
    expect(shouldIncludeInSitemap('/spain/barcelona/clubs')).toBe(true);
  });
});
