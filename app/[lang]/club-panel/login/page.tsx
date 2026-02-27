'use client';

export const dynamic = 'force-dynamic';

import { useActionState, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { Mail, Lock, ArrowLeft, AlertCircle, Loader2, Eye, EyeOff } from '@/lib/icons';
import { login, signInWithOAuth } from '@/app/actions/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useLanguage } from '@/hooks/useLanguage';

function ClubLoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/club-panel/dashboard';
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    message: '',
  });

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    if (provider === 'google') setIsGoogleLoading(true);
    else setIsAppleLoading(true);

    try {
      const result = await signInWithOAuth(provider);
      if (result.success && result.data) {
        window.location.href = result.data;
      }
    } catch (error) {
      console.error('OAuth error:', error);
    } finally {
      setIsGoogleLoading(false);
      setIsAppleLoading(false);
    }
  };

  return (
    <>
      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-11"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isGoogleLoading || isAppleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="h-4 w-4" />
          )}
          {t('auth.login.continue_google')}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-11"
          onClick={() => handleOAuthSignIn('apple')}
          disabled={isGoogleLoading || isAppleLoading}
        >
          {isAppleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FaApple className="h-4 w-4" />
          )}
          {t('auth.login.continue_apple')}
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-gray-500">
            {t('auth.login.continue_email')}
          </span>
        </div>
      </div>

      {state?.message && !state?.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Hidden redirect field */}
        <input type="hidden" name="redirect" value={redirectTo} />
        
        {/* Hidden remember me field */}
        <input type="hidden" name="rememberMe" value={rememberMe ? 'true' : 'false'} />

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-gray-500" />
            {t('club_panel.login.email_label')}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t('club_panel.login.email_placeholder')}
            className="w-full"
            required
            disabled={isPending}
          />
          {state?.errors?.email && (
            <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-gray-500" />
            {t('form.password')}
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {state?.errors?.password && (
            <p className="text-sm text-red-600 mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isPending}
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
              {t('auth.login.remember_me')}
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-green-600 hover:text-green-700"
          >
            {t('auth.login.forgot_password')}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('auth.login.signing_in')}
            </>
          ) : (
            t('auth.login.submit')
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {t('auth.login.no_account')}{' '}
          <Link href="/club-panel/signup" className="text-green-600 hover:text-green-700 font-medium">
            {t('club_panel.login.register_club_link')}
          </Link>
        </p>
      </div>
    </>
  );
}

export default function ClubLoginPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100/40 flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="w-full max-w-md">
        <Link href="/club-panel" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>{t('club_panel.common.back')}</span>
        </Link>

        <Card className="p-8 shadow-xl border-2">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <LogoIcon size="lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t('brand.name')}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {t('club_panel.login.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('club_panel.login.subtitle')}
            </p>
          </div>

          <Suspense fallback={<div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-green-600" /></div>}>
            <ClubLoginForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
