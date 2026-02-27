'use client';

import { ProfileSidebar, ProfileMobileNav } from '@/components/profile/ProfileSidebar';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/20 pt-16 md:pt-20">
      <ProfileSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation Toggle - Only visible on small screens */}
        <div className="lg:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-3">
          <ProfileMobileNav />
          <span className="font-semibold text-foreground">{t('common.menu')}</span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
