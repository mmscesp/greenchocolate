'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login, signInWithOAuth } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Leaf, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isGoogleLoading || isAppleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FcGoogle className="h-5 w-5" />
          )}
          Continue with Google
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => handleOAuthSignIn('apple')}
          disabled={isGoogleLoading || isAppleLoading}
        >
          {isAppleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FaApple className="h-5 w-5" />
          )}
          Continue with Apple
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden redirect field */}
        <input type="hidden" name="redirect" value={redirectUrl} />
        
        {/* Hidden remember me field */}
        <input type="hidden" name="rememberMe" value={rememberMe ? 'true' : 'false'} />

        {state?.message && !state?.success && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {state.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              required
              disabled={isPending}
            />
          </div>
          {state?.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pl-10 pr-10"
              required
              disabled={isPending}
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
            <p className="text-sm text-destructive">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isPending}
          />
          <Label 
            htmlFor="rememberMe" 
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Remember me for 30 days
          </Label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/account/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
}
