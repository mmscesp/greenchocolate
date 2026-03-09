'use client';

import { ClubSidebar, ClubMobileNav } from '@/components/club/ClubSidebar';
import LanguageSelector from '@/components/LanguageSelector';
import { ArrowLeft } from '@/lib/icons';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, t } = useLanguage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/20 pt-16 md:pt-20">
      <ClubSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-16 md:top-20 z-20 bg-background/80 backdrop-blur-sm border-b h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <ClubMobileNav />
            
            <Link
              href={`/${language}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">{t('nav.back_to_site')}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-muted-foreground font-medium">
              {t('club_panel.header.subtitle')}
            </div>
            <LanguageSelector />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
