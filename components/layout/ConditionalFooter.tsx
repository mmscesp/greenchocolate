'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { isLocale } from '@/lib/i18n-config';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const segments = (pathname || '/').split('/');
  const firstSegment = segments[1] ?? '';
  const normalizedPathname = isLocale(firstSegment)
    ? `/${segments.slice(2).join('/')}`.replace(/\/+$/, '') || '/'
    : pathname || '/';
  
  // Hide footer on profile, club-panel, and admin dashboard pages
  const isDashboardRoute =
    normalizedPathname.startsWith('/profile') ||
    normalizedPathname.startsWith('/club-panel') ||
    normalizedPathname.startsWith('/admin');
  
  if (isDashboardRoute) {
    return null;
  }
  
  return <Footer />;
}
