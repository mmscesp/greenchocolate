'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from '@/lib/icons';
import LanguageSelector from '@/components/LanguageSelector';
import { AdminSidebar, AdminMobileNav } from '@/components/admin/AdminSidebar';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 pt-24 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1680px] items-start gap-4 px-4 pb-8 lg:gap-8 lg:px-6 xl:px-8">
        <AdminSidebar adminInfo={adminInfo} lang={lang} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-24 z-20 flex h-16 items-center justify-between rounded-[24px] border border-slate-800 bg-slate-900/95 px-4 backdrop-blur-sm lg:px-6">
            <div className="flex items-center gap-4">
              <AdminMobileNav adminInfo={adminInfo} lang={lang} />

              <Link
                href={`/${lang}`}
                className="hidden items-center gap-2 text-slate-400 transition-colors hover:text-slate-100 sm:flex"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">{t('nav.back_to_site')}</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-400 sm:flex">
                <Shield className="h-4 w-4 text-green-400" />
                {t('admin.shell.mode')}
              </div>
              <LanguageSelector />
            </div>
          </header>

          <main className="flex-1 py-4 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
