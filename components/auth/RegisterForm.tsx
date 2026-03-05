'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { signUp, signInWithOAuth } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LogoIcon } from '@/components/ui/logo';
import { Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function RegisterForm() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
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
    { met: password.length >= 8, text: t('auth.register.password_rules.min_length') },
    { met: /[A-Z]/.test(password), text: t('auth.register.password_rules.uppercase') },
    { met: /[0-9]/.test(password), text: t('auth.register.password_rules.number') },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: t('auth.register.password_rules.special') },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    
    if (password !== confirmPassword) {
      e.preventDefault();
      setClientError(t('auth.register.errors.password_mismatch'));
      return;
    }

    if (!allRequirementsMet) {
      e.preventDefault();
      setClientError(t('auth.register.errors.password_requirements'));
      return;
    }

    if (!consent) {
      e.preventDefault();
      setClientError(t('auth.register.errors.accept_terms'));
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
          {/* [motion] */}
          <motion.svg viewBox="0 0 24 24" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            />
          </motion.svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.register.check_email.title')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('auth.register.check_email.description')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('auth.register.check_email.already_verified')}{' '}
          <Link href={`/${language}/account/login`} className="text-primary hover:underline font-medium">
            {t('auth.login.submit')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <LogoIcon size="lg" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">{t('auth.register.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('auth.register.subtitle')}</p>
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
          {t('auth.register.continue_google')}
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
          {t('auth.register.continue_apple')}
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('auth.register.continue_email')}
          </span>
        </div>
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
        {(clientError || (state?.message && !state?.success)) && (
          // [motion]
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, x: [0, -6, 6, -4, 4, 0] }
            }
            transition={{ duration: 0.35 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {clientError || state?.message}
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">{t('form.full_name')}</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder={t('auth.placeholders.full_name')}
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
          <Label htmlFor="email">{t('form.email')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('auth.placeholders.email')}
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
          <Label htmlFor="password">{t('form.password')}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.placeholders.create_password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={isPending}
              minLength={8}
            />
            {/* [motion] */}
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={shouldReduceMotion ? undefined : { rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.button>
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
          <Label htmlFor="confirmPassword">{t('auth.register.confirm_password')}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.placeholders.confirm_password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
              disabled={isPending}
            />
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-destructive">{t('auth.register.errors.password_mismatch')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-muted-foreground">{t('auth.register.phone_optional')}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder={t('auth.placeholders.phone')}
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
              {t('auth.register.accept_terms')}
            </Label>
            <p className="text-xs text-muted-foreground">
              <strong>{t('auth.register.age_restriction_label')}</strong> {t('auth.register.age_restriction_text')}
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
              {t('auth.register.creating_account')}
            </>
          ) : (
            t('auth.register.submit')
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {t('auth.register.has_account')}{' '}
          <Link href={`/${language}/account/login`} className="text-primary hover:underline font-medium">
            {t('auth.login.submit')}
          </Link>
        </div>
      </form>
    </div>
  );
}
