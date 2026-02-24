'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from '@/lib/icons';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();
  
  const [state, formAction, isPending] = useActionState(async () => {
    const { error } = await resetPassword(email);
    return {
      success: !error,
      message: error?.message || '',
    };
  }, {
    success: false,
    message: '',
  });

  if (state?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Sent
          </h2>
          <p className="text-gray-600 mb-8">
            If an account exists with <strong>{email}</strong>,
            you will receive a password reset link.
          </p>
          <div className="space-y-3">
            <Link href="/account/login" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Back to Sign In
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/account/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>

        <Card className="p-8 shadow-xl border-2">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <LogoIcon size="lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SocialClubsMaps
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              Forgot Your Password?
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {state?.message && !state?.success && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
                disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/account/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
