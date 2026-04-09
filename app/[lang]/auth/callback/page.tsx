'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogoIcon } from '@/components/ui/logo';
import { Loader2, CheckCircle, AlertCircle } from '@/lib/icons';
import { createClient } from '@/lib/supabase/client';
import { getLandingPageByRole } from '@/lib/auth-utils';
import { getSafeRedirectPath } from '@/lib/auth-urls';
import { useLanguage } from '@/hooks/useLanguage';

type CallbackProfileResponse = {
  profile?: {
    role?: 'USER' | 'ADMIN' | 'CLUB_ADMIN';
  };
};

type CallbackStatus = 'verifying' | 'success' | 'error';

const SESSION_POLL_INTERVAL_MS = 150;
const SESSION_POLL_TIMEOUT_MS = 4000;
const PROFILE_RETRY_INTERVAL_MS = 200;
const PROFILE_RETRY_ATTEMPTS = 5;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForSession(
  supabase: SupabaseClient,
  timeoutMs = SESSION_POLL_TIMEOUT_MS
) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { session: null, error };
    }

    if (session) {
      return { session, error: null };
    }

    await sleep(SESSION_POLL_INTERVAL_MS);
  }

  return { session: null, error: null };
}

async function resolveLandingPage(
  language: string,
  requestedRedirect: string | null
): Promise<string> {
  if (requestedRedirect) {
    return getSafeRedirectPath(requestedRedirect, language, getLandingPageByRole('USER', language));
  }

  for (let attempt = 0; attempt < PROFILE_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch('/api/profile/me', {
        cache: 'no-store',
      });

      if (response.ok) {
        const payload = (await response.json()) as CallbackProfileResponse;
        return getSafeRedirectPath(
          null,
          language,
          getLandingPageByRole(payload.profile?.role || 'USER', language)
        );
      }
    } catch (error) {
      console.error('Profile bootstrap lookup failed:', error);
    }

    await sleep(PROFILE_RETRY_INTERVAL_MS);
  }

  return getSafeRedirectPath(null, language, getLandingPageByRole('USER', language));
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;
  const [status, setStatus] = useState<CallbackStatus>('verifying');
  const [message, setMessage] = useState('');
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isCancelled = false;

    const clearAuthHash = () => {
      if (!window.location.hash) {
        return;
      }

      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    const completeWithError = (nextMessage: string) => {
      if (isCancelled) {
        return;
      }

      setStatus('error');
      setMessage(nextMessage);
    };

    const completeWithSuccess = async (requestedRedirect: string | null) => {
      const landingPage = await resolveLandingPage(language, requestedRedirect);

      if (isCancelled) {
        return;
      }

      setStatus('success');
      setMessage(t('auth_callback.messages.oauth_success'));

      window.setTimeout(() => {
        router.push(landingPage);
        router.refresh();
      }, 1200);
    };

    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const requestedRedirect = searchParams.get('redirect');
        const code = searchParams.get('code');
        const hasHashToken = window.location.hash.includes('access_token');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('OAuth callback error:', error);
            completeWithError(t('auth_callback.messages.oauth_failed'));
            return;
          }

          const { session, error: sessionError } = await waitForSession(supabase);

          if (sessionError) {
            console.error('OAuth session recovery error:', sessionError);
            completeWithError(t('auth_callback.messages.oauth_failed'));
            return;
          }

          if (!session) {
            completeWithError(t('auth.reset.errors.invalid_session'));
            return;
          }

          clearAuthHash();
          await completeWithSuccess(requestedRedirect);
          return;
        }

        if (hasHashToken) {
          const { session, error } = await waitForSession(supabase);
          clearAuthHash();

          if (error) {
            console.error('Email confirmation callback error:', error);
            completeWithError(t('auth_callback.messages.verify_failed'));
            return;
          }

          if (!session) {
            completeWithError(t('auth.reset.errors.invalid_session'));
            return;
          }

          if (isCancelled) {
            return;
          }

          setStatus('success');
          setMessage(t('auth_callback.messages.verify_success'));

          const landingPage = await resolveLandingPage(language, requestedRedirect);
          if (isCancelled) {
            return;
          }

          window.setTimeout(() => {
            router.push(landingPage);
            router.refresh();
          }, 1500);
          return;
        }

        completeWithError(t('auth_callback.messages.unexpected_error'));
      } catch (error) {
        console.error('Callback processing error:', error);
        completeWithError(t('auth_callback.messages.unexpected_error'));
      }
    };

    void handleAuthCallback();

    return () => {
      isCancelled = true;
    };
  }, [language, router, supabase, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 pt-16 md:pt-20">
      <Card className="p-8 max-w-md w-full text-center shadow-xl">
        <Link href={`/${language}`} className="inline-flex items-center gap-2 mb-6">
          <LogoIcon size="lg" />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t('brand.name')}
          </span>
        </Link>

        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('auth_callback.headings.verifying')}
            </h2>
            <p className="text-gray-600">
              {t('auth_callback.messages.verifying')}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('auth_callback.headings.success')}
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              {t('auth_callback.redirecting')}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('auth_callback.headings.error')}
            </h2>
            <p className="text-gray-600 mb-8">
              {message}
            </p>
            <div className="space-y-3">
              <Link href={withLocale('/account/login')}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t('auth_callback.actions.sign_in')}
                </Button>
              </Link>
              <Link href={withLocale('/resend-confirmation')}>
                <Button variant="secondary" className="w-full">
                  {t('auth_callback.actions.resend')}
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
