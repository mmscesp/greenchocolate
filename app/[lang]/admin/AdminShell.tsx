'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from '@/lib/icons';
import LanguageSelector from '@/components/LanguageSelector';
import { AdminSidebar, AdminMobileNav } from '@/components/admin/AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  lang: string;
  adminInfo: {
    displayName?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

export default function AdminShell({ children, lang, adminInfo }: AdminShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        adminInfo={adminInfo}
        lang={lang}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <AdminMobileNav adminInfo={adminInfo} lang={lang} />

            <Link
              href={`/${lang}`}
              className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Site</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-medium bg-slate-800 px-3 py-1.5 rounded-full">
              <Shield className="h-4 w-4 text-green-400" />
              Admin Mode
            </div>
            <LanguageSelector />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
