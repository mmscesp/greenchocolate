'use client';

export const dynamic = 'force-dynamic';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Logo, LogoIcon } from '@/components/ui/logo';
import { Building, Mail, Lock, MapPin, Phone, ArrowLeft, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from '@/lib/icons';
import { clubSignUp } from '@/app/actions/club-auth';
import { signInWithOAuth } from '@/app/actions/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useLanguage } from '@/hooks/useLanguage';

export default function ClubSignupPage() {
  const { t } = useLanguage();
  const formatText = (key: string, values: Record<string, string | number>) => {
    let message = t(key);

    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{{${name}}}`, String(value));
    }

    return message;
  };

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  
  // Form state for multi-step form
  const [formData, setFormData] = useState({
    clubName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    description: '',
  });
  
  const [state, formAction, isPending] = useActionState(clubSignUp, {
    success: false,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setClientError(null);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    // Validate step 1
    if (!formData.clubName || !formData.email || !formData.password) {
      setClientError(t('club_panel.signup.errors.fill_all_fields'));
      return;
    }
    if (formData.password.length < 8) {
      setClientError(t('club_panel.signup.errors.password_min_length'));
      return;
    }
    
    setStep(2);
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

  // Show success state
  if (state?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100/40 flex items-center justify-center p-4 pt-16 md:pt-20">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('club_panel.signup.success.title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {formatText('club_panel.signup.success.description', { clubName: formData.clubName })}
          </p>
          <div className="space-y-3">
            <Link href="/club-panel/login" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                {t('club_panel.signup.success.go_to_sign_in')}
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                {t('club_panel.entry.back_to_home')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100/40 pt-24 md:pt-32 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={step === 1 ? "/club-panel" : "#"}
          onClick={(e) => {
            if (step > 1) {
              e.preventDefault();
              setStep(step - 1);
            }
          }}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('club_panel.common.back')}</span>
        </Link>

        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <LogoIcon size="lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t('brand.name')}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {t('club_panel.signup.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {formatText('club_panel.signup.step_counter', { step, total: 2 })}
            </p>
          </div>

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
              {t('auth.register.continue_google')}
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
              {t('auth.register.continue_apple')}
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-500">
                {t('auth.register.continue_email')}
              </span>
            </div>
          </div>

          {(clientError || (state?.message && !state?.success)) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{clientError || state?.message}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <Label htmlFor="clubName" className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  {t('club_panel.signup.club_name_label')}
                </Label>
                <Input
                  id="clubName"
                  name="clubName"
                  type="text"
                  placeholder={t('club_panel.signup.club_name_placeholder')}
                  value={formData.clubName}
                  onChange={handleChange}
                  required
                />
                {state?.errors?.clubName && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.clubName[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {t('club_panel.signup.contact_email_label')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('club_panel.signup.contact_email_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                    placeholder={t('club_panel.signup.password_placeholder')}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('club_panel.signup.password_hint')}
                </p>
                {state?.errors?.password && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.password[0]}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {t('club_panel.signup.next')}
              </Button>
            </form>
          ) : (
            <form action={formAction} className="space-y-6">
              {/* Hidden fields from step 1 */}
              <input type="hidden" name="clubName" value={formData.clubName} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="password" value={formData.password} />

              <div>
                <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {t('club_panel.signup.address_label')}
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder={t('club_panel.signup.address_placeholder')}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
                {state?.errors?.address && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.address[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {t('form.phone')}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t('club_panel.signup.phone_placeholder')}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
                {state?.errors?.phone && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.phone[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  {t('club_panel.signup.description_label')}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t('club_panel.signup.description_placeholder')}
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  disabled={isPending}
                  minLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('club_panel.signup.description_hint')}
                </p>
                {state?.errors?.description && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.description[0]}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('club_panel.signup.registering')}
                  </>
                ) : (
                  t('club_panel.entry.register_title')
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            {t('club_panel.signup.already_have_account')}{' '}
            <Link href="/club-panel/login" className="text-green-600 hover:text-green-700 font-medium">
              {t('auth.login.submit')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
