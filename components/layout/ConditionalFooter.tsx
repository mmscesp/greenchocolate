'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on profile and club-panel dashboard pages
  const isDashboardRoute = pathname?.startsWith('/profile') || 
                           pathname?.startsWith('/en/profile') ||
                           pathname?.startsWith('/es/profile') ||
                           pathname?.startsWith('/de/profile') ||
                           pathname?.startsWith('/fr/profile') ||
                           pathname?.startsWith('/it/profile') ||
                           pathname?.startsWith('/club-panel');
  
  if (isDashboardRoute) {
    return null;
  }
  
  return <Footer />;
}
