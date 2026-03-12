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
    <div className="min-h-screen bg-slate-950 pt-4 lg:pt-6 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1680px] items-start gap-4 px-3 pb-8 sm:px-4 lg:gap-8 lg:px-6 xl:px-8">
        <AdminSidebar adminInfo={adminInfo} lang={lang} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-4 lg:top-6 z-20 flex min-h-16 items-center justify-between gap-3 rounded-[24px] border border-slate-800 bg-slate-900/95 px-3 backdrop-blur-sm sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <AdminMobileNav adminInfo={adminInfo} lang={lang} />

              <Link
                href={`/${lang}`}
                aria-label={t('nav.back_to_site')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-800/70 text-slate-300 transition-colors hover:text-slate-100 sm:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <Link
                href={`/${lang}`}
                className="hidden items-center gap-2 text-slate-400 transition-colors hover:text-slate-100 sm:flex"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">{t('nav.back_to_site')}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 sm:hidden">
                <Shield className="h-3.5 w-3.5 text-green-400" />
                <span>{t('admin.shell.mode')}</span>
              </div>
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
