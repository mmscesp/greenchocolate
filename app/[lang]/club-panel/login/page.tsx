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
import { Mail, Lock, ArrowLeft, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { login, signInWithOAuth } from '@/app/actions/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

function ClubLoginForm() {
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
          Continue with Google
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
          Continue with Apple
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">
            Or sign in with email
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
            Club Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="club@example.com"
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
            Password
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
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-green-600 hover:text-green-700"
          >
            Forgot password?
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/club-panel/signup" className="text-green-600 hover:text-green-700 font-medium">
            Register your club
          </Link>
        </p>
      </div>
    </>
  );
}

export default function ClubLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/club-panel" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
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
              Club Panel Access
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to manage your club
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
