'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { Loader2, CheckCircle, AlertCircle } from '@/lib/icons';
import { createClient } from '@/lib/supabase/client';
import { getLandingPageByRole } from '@/lib/auth-utils';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Auth Callback Page
 * Handles email confirmation and OAuth callbacks from Supabase
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const withLocale = (path: string) => `/${language}${path}`;
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const localizeLandingPage = (path: string) => {
      if (!path || path === '/') {
        return `/${language}`;
      }

      if (path === `/${language}` || path.startsWith(`/${language}/`)) {
        return path;
      }

      return `/${language}${path}`;
    };

    const clearAuthHash = () => {
      if (!window.location.hash) {
        return;
      }

      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // Get the URL hash which contains the tokens from email confirmation
        const hash = window.location.hash;
        
        if (hash && hash.includes('access_token')) {
          // Email confirmation flow - tokens are in hash
          // Supabase automatically handles the token exchange
          const { data: { session }, error } = await supabase.auth.getSession();
          clearAuthHash();
          
            if (error) {
              console.error('Auth callback error:', error);
              setStatus('error');
              setMessage('Failed to verify your email. The link may have expired.');
              return;
            }
            
            if (session) {

            setStatus('success');
            setMessage('Your email has been verified successfully!');
            
            // Get user profile to determine role-based landing page
            const { data: profile } = await supabase
              .from('Profile')
              .select('role')
              .eq('authId', session.user.id)
              .single();

            const landingPage = localizeLandingPage(getLandingPageByRole(profile?.role || 'USER'));
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push(landingPage);
              router.refresh();
            }, 2000);
          }

        } else {
          // Check if there's a code parameter (PKCE flow for OAuth)
          const searchParams = new URLSearchParams(window.location.search);
          const code = searchParams.get('code');
          
          if (code) {
            // OAuth callback with code - exchange for session
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('OAuth callback error:', error);
              setStatus('error');
              setMessage('Failed to complete authentication.');
              return;
            }
            
            setStatus('success');
            setMessage('Authentication successful!');
            
            // Get session to find user profile
            const { data: { session } } = await supabase.auth.getSession();
            let landingPage = `/${language}`;
            
            if (session) {
              const { data: profile } = await supabase
                .from('Profile')
                .select('role')
                .eq('authId', session.user.id)
                .single();
              landingPage = localizeLandingPage(getLandingPageByRole(profile?.role || 'USER'));
            }
            
            setTimeout(() => {
              router.push(landingPage);
              router.refresh();
            }, 1500);
          }

        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [language, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 pt-16 md:pt-20">
      <Card className="p-8 max-w-md w-full text-center shadow-xl">
        <Link href={`/${language}`} className="inline-flex items-center gap-2 mb-6">
          <LogoIcon size="lg" />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            SocialClubsMaps
          </span>
        </Link>

        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to the dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-8">
              {message}
            </p>
            <div className="space-y-3">
              <Link href={withLocale('/account/login')}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Sign In
                </Button>
              </Link>
              <Link href={withLocale('/resend-confirmation')}>
                <Button variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
