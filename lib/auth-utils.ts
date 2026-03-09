import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';
import { UserRole } from './types';

/**
 * Determines the correct landing page for a user based on their role.
 * @param role The role of the user
 * @param lang The current language locale
 * @returns The absolute path for the landing page
 */
export function getLandingPageByRole(role: UserRole | string, lang: string = i18n.defaultLocale): string {
  switch (role) {
    case 'CLUB_ADMIN':
      return `/${lang}/club-panel/dashboard`;
    case 'ADMIN':
      return `/${lang}/admin`;
    case 'USER':
    default:
      return `/${lang}`;
  }
}

/**
 * Server-side redirect based on user role.
 */
export function roleRedirect(role: UserRole | string, lang: string = i18n.defaultLocale) {
  return redirect(getLandingPageByRole(role, lang));
}
