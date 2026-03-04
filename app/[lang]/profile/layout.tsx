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
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-base text-white relative overflow-hidden pt-16 md:pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/20 via-bg-base to-bg-base pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[12%] h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-brand/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full">
        <ProfileSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden sticky top-0 z-20 bg-bg-base/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
            <ProfileMobileNav />
            <span className="font-bold text-[10px] uppercase tracking-widest text-brand">{t('common.menu')}</span>
          </div>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-12 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
