'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from '@/lib/icons';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/hooks/useLanguage';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const { updatePassword, session } = useAuth();

  useEffect(() => {
    const clearAuthHash = () => {
      if (!window.location.hash) {
        return;
      }

      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    const checkSession = async () => {
      if (!session) {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          clearAuthHash();
          setIsValidating(false);
        } else {
          setError(t('auth.reset.errors.invalid_session'));
        }
      } else {
        clearAuthHash();
        setIsValidating(false);
      }
    };

    checkSession();
  }, [session, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t('auth.reset.errors.min_length'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.register.errors.password_mismatch'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(t('auth.reset.errors.unexpected'));
      console.error('Update password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 pt-16 md:pt-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 pt-16 md:pt-20">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('auth.reset.success.title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('auth.reset.success.description')}
          </p>
          <div className="space-y-3">
            <Link href={withLocale('/account/login')} className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                {t('auth.login.submit')}
              </Button>
            </Link>
            <Link href={`/${language}`} className="block">
              <Button variant="outline" className="w-full">
                {t('auth.forgot.back_to_home')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="w-full max-w-md">
        <Link href={withLocale('/account/login')} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>{t('auth.forgot.back')}</span>
        </Link>

        <Card className="p-8 shadow-xl border-2">
          <div className="text-center mb-8">
            <Link href={`/${language}`} className="inline-flex items-center gap-2 mb-4">
              <LogoIcon size="lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t('brand.name')}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {t('auth.reset.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('auth.reset.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gray-500" />
                {t('auth.reset.new_password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  disabled={loading}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('auth.reset.minimum_characters')}</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gray-500" />
                {t('auth.register.confirm_password')}
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('auth.reset.updating')}
                </>
              ) : (
                t('auth.reset.update_password')
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
