'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, signInWithOAuth } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Leaf, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function RegisterForm() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  
  const [state, formAction, isPending] = useActionState(signUp, {
    success: false,
    message: '',
  });

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    
    if (password !== confirmPassword) {
      e.preventDefault();
      setClientError('Passwords do not match');
      return;
    }

    if (!allRequirementsMet) {
      e.preventDefault();
      setClientError('Please meet all password requirements');
      return;
    }

    if (!consent) {
      e.preventDefault();
      setClientError('You must accept the terms and conditions');
      return;
    }
  };

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

  // Show success state when signup is successful (message indicates email confirmation)
  if (state?.success && state?.message?.includes('email')) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-6">
          We've sent a verification link to your email address.
          Please check your inbox and verify your account.
        </p>
        <p className="text-sm text-muted-foreground">
          Already verified?{' '}
          <Link href="/account/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
        <p className="text-muted-foreground mt-2">Join our community of cannabis enthusiasts</p>
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
          Sign up with Google
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
          Sign up with Apple
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

      <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
        {(clientError || (state?.message && !state?.success)) && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {clientError || state?.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              className="pl-10"
              required
              disabled={isPending}
            />
          </div>
          {state?.errors?.fullName && (
            <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>
          )}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={isPending}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            {passwordRequirements.map((req, index) => (
              <div key={index} className={`flex items-center gap-2 ${req.met ? 'text-green-600 dark:text-green-400' : ''}`}>
                <CheckCircle className={`h-3 w-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                {req.text}
              </div>
            ))}
          </div>
          {state?.errors?.password && (
            <p className="text-sm text-destructive">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
              disabled={isPending}
            />
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-muted-foreground">Phone (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            disabled={isPending}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="consent" 
            name="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            disabled={isPending}
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="consent" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the Terms of Service and Privacy Policy
            </Label>
            <p className="text-xs text-muted-foreground">
              <strong>Age Restriction:</strong> You must be 18+ to create an account.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending || !allRequirementsMet || !passwordsMatch || !consent}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/account/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
