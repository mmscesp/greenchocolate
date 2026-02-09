import React from 'react';
import PublicNavbar from '@/components/layout/public/Navbar';
import VerifiedNavbar from '@/components/layout/verified/Navbar';
import Footer from '@/components/layout/Footer';
import { Locale } from '@/lib/i18n-config';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
  verified?: boolean; // Determine layout type
}

export default async function Layout({ children, params, verified = false }: LayoutProps) {
  const { lang } = await params;
  
  return (
    <div className="flex flex-col min-h-screen">
      {verified ? <VerifiedNavbar lang={lang as Locale} /> : <PublicNavbar lang={lang as Locale} />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
