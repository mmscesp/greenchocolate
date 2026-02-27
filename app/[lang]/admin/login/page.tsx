'use client';

export const dynamic = 'force-dynamic';

import { useActionState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Shield, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from '@/lib/icons';
import { adminLogin } from '@/app/actions/admin-auth';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

function AdminLoginForm() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || 'en';
  
  const [state, formAction, isPending] = useActionState(adminLogin, {
    success: false,
    message: '',
  });

  return (
    <>
      {state?.message && !state?.success && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="lang" value={lang} />
        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {t('admin.login.email')}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t('admin.login.email_placeholder')}
            className="w-full"
            required
            disabled={isPending}
            autoComplete="email"
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            {t('admin.login.password')}
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pr-10"
              required
              disabled={isPending}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {state?.errors?.password && (
            <p className="text-sm text-red-600 mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('admin.login.authenticating')}
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              {t('admin.login.access_portal')}
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-sm text-muted-foreground">
          {t('admin.login.not_admin')} {' '}
          <Link href={`/${lang}`} className="text-primary hover:underline">
            {t('admin.login.return_home')}
          </Link>
        </p>
      </div>
    </>
  );
}

export default function AdminLoginPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-100 mb-4">
              <Shield className="h-8 w-8 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {t('admin.login.hero_title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {t('admin.login.hero_subtitle')}
            </p>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
            </div>
          }>
            <AdminLoginForm />
          </Suspense>
        </Card>

        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6">
          {t('admin.login.unauthorized_notice')}
          <br />
          {t('admin.login.audit_notice')}
        </p>
      </div>
    </div>
  );
}
