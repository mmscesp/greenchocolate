'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Check, AlertCircle, Loader2 } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/components/auth/AuthProvider';
import { Club } from '@/lib/types';
import {
  createMembershipApplicationLead,
  submitMembershipApplication,
} from '@/app/actions/applications';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { getCountryOptions } from '@/lib/countries';
import { MembershipApplicationChallenge } from '@/components/security/MembershipApplicationChallenge';

interface MembershipApplicationModalProps {
  club: Club;
  isOpen: boolean;
  onClose: () => void;
  clubImage: string;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  countryCode: string;
  experience: string;
  message: string;
  phone: string;
  ageConfirmed: boolean;
  termsConfirmed: boolean;
};

type FormState = {
  success: boolean;
  message?: string;
  needsAccount?: boolean;
};

const pendingMembershipLeadStorageKey = 'pendingMembershipLead';
const hasTurnstileSiteKey = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function MembershipApplicationModal({
  club,
  isOpen,
  onClose,
  clubImage,
}: MembershipApplicationModalProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [requiresChallenge, setRequiresChallenge] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const countryOptions = useMemo(() => getCountryOptions(language), [language]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: '',
    countryCode: '',
    experience: '',
    message: '',
    phone: '',
    ageConfirmed: false,
    termsConfirmed: false,
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      country: '',
      countryCode: '',
      experience: '',
      message: '',
      phone: '',
      ageConfirmed: false,
      termsConfirmed: false,
    });
    setFormState(null);
    setRequiresChallenge(false);
    setChallengeToken(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormState(null);

    try {
      if (!formData.ageConfirmed || !formData.termsConfirmed) {
        setFormState({
          success: false,
          message: t('club_profile.form.error_unexpected'),
        });
        return;
      }

      const submission = {
        targetClubId: club.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        city: formData.city,
        country: formData.country,
        countryCode: formData.countryCode,
        experience: formData.experience as 'curious' | 'casual' | 'regular' | 'connoisseur' | 'medical',
        message: formData.message,
        phone: formData.phone,
        ageConfirmed: true as const,
        termsConfirmed: true as const,
        ...(challengeToken ? { challengeToken } : {}),
      };

      // If user is logged in, submit directly
      if (user) {
        const result = await submitMembershipApplication(submission);

        if (result.success) {
          setFormState({
            success: true,
            message: t('club_profile.modal.success.message'),
          });
          setTimeout(() => {
            handleClose();
          }, 2000);
        } else if (result.challengeRequired) {
          setRequiresChallenge(true);
          setFormState({
            success: false,
            message: result.error || t('club_profile.modal.challenge_required'),
          });
        } else {
          setFormState({
            success: false,
            message: result.error || t('club_profile.form.error_unexpected'),
          });
        }
      } else {
        const result = await createMembershipApplicationLead(submission);

        if (result.success && result.pendingLeadToken) {
          try {
            sessionStorage.removeItem('pendingApplication');
            sessionStorage.setItem(
              pendingMembershipLeadStorageKey,
              JSON.stringify({
                pendingLeadToken: result.pendingLeadToken,
                clubId: club.id,
                clubSlug: club.slug,
                expiresAt: result.expiresAt,
              })
            );
          } catch (err) {
            console.error('Failed to save membership lead to sessionStorage', err);
          }

          setFormState({
            success: true,
            message: t('club_profile.modal.success.message'),
            needsAccount: true,
          });

          setTimeout(() => {
            router.push(`/${language}/account/register?redirect=/${language}/clubs/${club.slug}`);
          }, 1500);
        } else if (result.challengeRequired) {
          setRequiresChallenge(true);
          setFormState({
            success: false,
            message: result.error || t('club_profile.modal.challenge_required'),
          });
        } else {
          setFormState({
            success: false,
            message: result.error || t('club_profile.form.error_unexpected'),
          });
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFormState({
        success: false,
        message: t('club_profile.form.error_unexpected'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCountry = (countryCode: string) => {
    const selectedCountry = countryOptions.find((option) => option.code === countryCode);

    setFormData((prev) => ({
      ...prev,
      countryCode,
      country: selectedCountry?.label || '',
    }));
  };

  const canSubmit =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.city &&
    formData.country &&
    formData.countryCode &&
    formData.experience &&
    formData.message &&
    formData.ageConfirmed &&
    formData.termsConfirmed &&
    (!requiresChallenge || !hasTurnstileSiteKey || Boolean(challengeToken));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-bg-base/80 p-0 sm:p-4 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              relative w-full overflow-hidden bg-bg-surface border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.8)]
              h-[100dvh] rounded-none border-x-0 border-b-0
              sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-[2.5rem] sm:border
            "
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <div className="h-full overflow-y-auto no-scrollbar pb-10 sm:pb-0">
              {/* Header */}
              <div className="relative h-40 overflow-hidden bg-bg-base shrink-0">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-surface via-bg-surface/40 to-transparent" />
                <Image
                  src={clubImage}
                  alt={t('club_profile.modal.header_alt').replace('{clubName}', club.name)}
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute bottom-0 left-0 z-20 p-6">
                  <ConciergeLabel className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    {t('club_profile.modal.title')}
                  </ConciergeLabel>
                  <h3 className="text-2xl font-serif text-white">{club.name}</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('common.close_modal')}
                  onClick={handleClose}
                  className="absolute right-4 top-4 z-30 rounded-full border border-white/10 bg-bg-base/40 text-white backdrop-blur-md hover:bg-white hover:text-bg-base"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6">
                {formState && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 flex items-start gap-3 rounded-2xl border p-5 ${
                      formState.success
                        ? 'border-brand/30 bg-brand/10 text-brand'
                        : 'border-red-500/20 bg-red-500/10 text-red-400'
                    }`}
                  >
                    {formState.success ? (
                      <Check className="mt-0.5 h-5 w-5" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-5 w-5" />
                    )}
                    <div>
                      <p className="text-sm font-medium leading-relaxed">
                        {formState.message}
                      </p>
                      {formState.needsAccount && (
                        <p className="mt-2 text-xs opacity-80">
                          {t('club_profile.modal.success.create_account')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {t('club_profile.modal.first_name')} *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        required
                        className="rounded-xl border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus:border-brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {t('club_profile.modal.last_name')} *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        required
                        className="rounded-xl border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus:border-brand"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {t('club_profile.modal.email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      required
                      className="rounded-xl border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus:border-brand"
                    />
                  </div>

                  {/* City & Country */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {t('club_profile.modal.city')} *
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        required
                        className="rounded-xl border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus:border-brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {t('club_profile.modal.country')} *
                      </Label>
                      <Select
                        value={formData.countryCode}
                        onValueChange={updateCountry}
                      >
                        <SelectTrigger
                          id="country"
                          className="h-11 rounded-xl border-white/10 bg-white/[0.02] text-left text-white focus:border-brand focus:ring-brand/30 focus:ring-offset-0 data-[placeholder]:text-zinc-500"
                        >
                          <SelectValue placeholder={t('club_profile.modal.country_placeholder')} />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-bg-surface/95 text-white backdrop-blur-xl">
                          {countryOptions.map((option) => (
                            <SelectItem
                              key={option.code}
                              value={option.code}
                              className="rounded-lg text-white focus:bg-white/10 focus:text-white"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {t('club_profile.modal.experience')} *
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => updateField('experience', value)}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.02] text-white focus:border-brand focus:ring-brand/30 focus:ring-offset-0 data-[placeholder]:text-zinc-500">
                        <SelectValue placeholder={t('club_profile.modal.experience_placeholder')} />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-bg-surface/95 text-white backdrop-blur-xl">
                        <SelectItem value="curious" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                          {t('club_profile.modal.experience.curious')}
                        </SelectItem>
                        <SelectItem value="casual" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                          {t('club_profile.modal.experience.casual')}
                        </SelectItem>
                        <SelectItem value="regular" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                          {t('club_profile.modal.experience.regular')}
                        </SelectItem>
                        <SelectItem value="connoisseur" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                          {t('club_profile.modal.experience.connoisseur')}
                        </SelectItem>
                        <SelectItem value="medical" className="rounded-lg text-white focus:bg-white/10 focus:text-white">
                          {t('club_profile.modal.experience.medical')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {t('club_profile.modal.message')} *
                    </Label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      required
                      rows={3}
                      placeholder={t('club_profile.modal.message_placeholder')}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white placeholder:text-zinc-600 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {t('club_profile.modal.phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="rounded-xl border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus:border-brand"
                    />
                    <p className="text-[10px] text-zinc-500">
                      {t('club_profile.modal.phone_hint')}
                    </p>
                  </div>

                  {/* Legal Checkboxes */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="ageConfirmed"
                        checked={formData.ageConfirmed}
                        onCheckedChange={(checked) => updateField('ageConfirmed', checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="ageConfirmed"
                        className="text-xs leading-relaxed text-zinc-400 cursor-pointer"
                      >
                        {t('club_profile.modal.age_confirmation')}
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="termsConfirmed"
                        checked={formData.termsConfirmed}
                        onCheckedChange={(checked) => updateField('termsConfirmed', checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="termsConfirmed"
                        className="text-xs leading-relaxed text-zinc-400 cursor-pointer"
                      >
                        {t('club_profile.modal.terms_agreement')}
                      </Label>
                    </div>
                  </div>

                  {requiresChallenge && (
                    <div className="space-y-3 rounded-2xl border border-brand/20 bg-brand/10 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                        Verification required
                      </p>
                      <p className="text-sm leading-relaxed text-zinc-300">
                        Complete the challenge to continue with your membership application.
                      </p>
                      {hasTurnstileSiteKey ? (
                        <MembershipApplicationChallenge onTokenChange={setChallengeToken} />
                      ) : (
                        <p className="text-xs text-zinc-400">
                          Verification is temporarily unavailable. Please try again later.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !canSubmit}
                      className="w-full rounded-full bg-brand py-4 text-sm font-bold uppercase tracking-wider text-bg-base shadow-[0_4px_20px_hsl(var(--brand)/0.3)] hover:bg-brand-dark disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('form.submitting')}
                        </span>
                      ) : (
                        t('club_profile.modal.submit')
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="w-full rounded-full py-3 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:bg-white/5 hover:text-white"
                    >
                      {t('form.cancel')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
