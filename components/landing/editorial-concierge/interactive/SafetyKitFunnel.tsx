'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_SPRING } from '../motion/config';
import { ShieldCheck, Download, AlertTriangle } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deliverSafetyKitLead } from '@/app/actions/lead-capture';
import { getSafetyKitAssetPaths, getSafetyKitPdfPath, normalizeSafetyKitLocale } from '@/lib/safety-kit';
import { trackEvent } from '@/lib/analytics';

interface SafetyKitFunnelProps {
  placement?: 'hero' | 'final_cta' | (string & {});
}

export function SafetyKitFunnel({ placement = 'hero' }: SafetyKitFunnelProps) {
  const { t, language } = useLanguage();
  const locale = normalizeSafetyKitLocale(language);
  const trackedPlacement = useMemo(
    () => placement.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'hero',
    [placement]
  );
  const leadSource = `safety_kit_funnel_${trackedPlacement}`;
  const ageGateTrackedRef = useRef(false);
  const downloadTrackedRef = useRef(false);
  const rejectedTrackedRef = useRef(false);

  // States: 'email' -> 'age_gate' -> 'download' | 'rejected'
  const [step, setStep] = useState<'email' | 'age_gate' | 'download' | 'rejected'>('email');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryPath, setDeliveryPath] = useState(getSafetyKitAssetPaths(locale).guidePath);
  const [downloadPath, setDownloadPath] = useState(getSafetyKitPdfPath(locale));
  const [deliverySupportKey, setDeliverySupportKey] = useState<'safety_kit.dl_support_email' | 'safety_kit.dl_support_direct'>('safety_kit.dl_support_email');

  useEffect(() => {
    trackEvent('safety_kit_funnel_view', {
      placement: trackedPlacement,
      locale,
    });
  }, [trackedPlacement, locale]);

  useEffect(() => {
    if (step === 'age_gate' && !ageGateTrackedRef.current) {
      trackEvent('safety_kit_funnel_age_gate_view', {
        placement: trackedPlacement,
        locale,
      });
      ageGateTrackedRef.current = true;
    }

    if (step === 'download' && !downloadTrackedRef.current) {
      trackEvent('safety_kit_funnel_success_view', {
        placement: trackedPlacement,
        locale,
      });
      downloadTrackedRef.current = true;
    }

    if (step === 'rejected' && !rejectedTrackedRef.current) {
      trackEvent('safety_kit_funnel_rejected_view', {
        placement: trackedPlacement,
        locale,
      });
      rejectedTrackedRef.current = true;
    }
  }, [step, trackedPlacement, locale]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    ageGateTrackedRef.current = false;
    trackEvent('safety_kit_funnel_submit_attempt', {
      placement: trackedPlacement,
      locale,
    });
    setStep('age_gate');
  };

  const handleAgeAnswer = async (isAdult: boolean) => {
    if (!isAdult) {
      rejectedTrackedRef.current = false;
      trackEvent('safety_kit_funnel_age_gate_reject', {
        placement: trackedPlacement,
        locale,
      });
      setStep('rejected');
      return;
    }

    downloadTrackedRef.current = false;
    trackEvent('safety_kit_funnel_age_gate_accept', {
      placement: trackedPlacement,
      locale,
    });
    setIsSubmitting(true);

    try {
      const result = await deliverSafetyKitLead({
        email,
        locale: language,
        source: leadSource,
      });

      setDeliveryPath(result.fallbackPath);
      setDownloadPath(result.downloadPath ?? getSafetyKitPdfPath(locale));
      setDeliverySupportKey(
        result.deliveryMode === 'email'
          ? 'safety_kit.dl_support_email'
          : 'safety_kit.dl_support_direct'
      );
      trackEvent(
        result.deliveryMode === 'email'
          ? 'safety_kit_funnel_delivery_success'
          : 'safety_kit_funnel_delivery_fallback',
        {
          placement: trackedPlacement,
          locale,
          delivery_mode: result.deliveryMode,
        }
      );
      setStep('download');
    } catch (error) {
      console.error('Safety Kit delivery failed:', error);
      setDeliveryPath(getSafetyKitAssetPaths(locale).guidePath);
      setDownloadPath(getSafetyKitPdfPath(locale));
      setDeliverySupportKey('safety_kit.dl_support_direct');
      trackEvent('safety_kit_funnel_delivery_fallback', {
        placement: trackedPlacement,
        locale,
        delivery_mode: 'direct',
      });
      setStep('download');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid={`safety-kit-funnel-${trackedPlacement}`}
      className="w-full relative min-h-[280px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border border-white/10 bg-bg-card/70 backdrop-blur-md shadow-2xl overflow-hidden"
    >
      <AnimatePresence mode="wait">
        
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={PREMIUM_SPRING}
            className="w-full max-w-sm mx-auto text-center"
          >
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
              <Input
                data-testid={`safety-kit-email-${trackedPlacement}`}
                type="email"
                name="email"
                autoComplete="email"
                placeholder={t('safety_kit.form_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-bg-base/70 border-white/10 focus-visible:ring-brand/50 text-white placeholder:text-zinc-500 rounded-xl"
              />
              <Button 
                type="submit" 
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                data-testid={`safety-kit-submit-${trackedPlacement}`}
                className="w-full"
              >
                {isSubmitting ? '...' : t('safety_kit.form_button')}
              </Button>
            </form>
            <p className="mt-4 text-[11px] text-zinc-500 max-w-xs mx-auto">
              {t('safety_kit.microcopy')}
            </p>
            <div className="mt-5">
              <Link
                href={`/${language}/editorial/safety-kit-visitors-spain`}
                data-testid={`safety-kit-open-guide-${trackedPlacement}`}
                onClick={() =>
                  trackEvent('safety_kit_funnel_open_guide_click', {
                    placement: trackedPlacement,
                    locale,
                  })
                }
                className="text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {t('safety_kit.open_guide')}
              </Link>
            </div>
          </motion.div>
        )}

        {step === 'age_gate' && (
          <motion.div
            key="age_gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={PREMIUM_SPRING}
            className="w-full max-w-sm mx-auto text-center"
          >
            <h3 className="text-white font-serif text-xl mb-2">{t('safety_kit.age_headline')}</h3>
            <p className="text-zinc-400 text-sm mb-6">{t('safety_kit.age_q')}</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                data-testid={`safety-kit-age-yes-${trackedPlacement}`}
                onClick={() => handleAgeAnswer(true)}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? '...' : t('safety_kit.age_yes')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                data-testid={`safety-kit-age-no-${trackedPlacement}`}
                onClick={() => handleAgeAnswer(false)}
                disabled={isSubmitting}
                className="flex-none"
              >
                {t('safety_kit.age_no')}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'rejected' && (
          <motion.div
            key="rejected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={PREMIUM_SPRING}
            className="w-full max-w-sm mx-auto text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {t('safety_kit.age_reject')}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-testid={`safety-kit-reset-${trackedPlacement}`}
              onClick={() => {
                ageGateTrackedRef.current = false;
                rejectedTrackedRef.current = false;
                downloadTrackedRef.current = false;
                trackEvent('safety_kit_funnel_reset', {
                  placement: trackedPlacement,
                  locale,
                });
                setStep('email');
              }}
              className="mt-6 text-zinc-500 hover:text-white"
            >
              {t('common.start_over')}
            </Button>
          </motion.div>
        )}

        {step === 'download' && (
          <motion.div
            key="download"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={PREMIUM_SPRING}
            className="w-full max-w-sm mx-auto text-center"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <ShieldCheck className="w-8 h-8 text-green-400" />
            </div>
            
            <h3 className="text-white font-serif text-xl mb-4">
              {t('safety_kit.dl_headline')}
            </h3>
            
            <Button asChild variant="primary" size="lg" className="mb-3 w-full">
              <a
                href={downloadPath}
                download
                data-testid={`safety-kit-download-pdf-${trackedPlacement}`}
                onClick={() =>
                  trackEvent('safety_kit_funnel_pdf_click', {
                    placement: trackedPlacement,
                    locale,
                  })
                }
              >
                <Download className="w-4 h-4" />
                {t('safety_kit.dl_button')}
              </a>
            </Button>

            <Button asChild variant="secondary" size="lg" className="mb-4 w-full">
              <Link
                href={deliveryPath}
                data-testid={`safety-kit-web-guide-${trackedPlacement}`}
                onClick={() =>
                  trackEvent('safety_kit_funnel_web_guide_click', {
                    placement: trackedPlacement,
                    locale,
                  })
                }
              >
                {t('safety_kit.dl_web_button')}
              </Link>
            </Button>
            
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              {t(deliverySupportKey)}
            </p>
            
            <div className="space-y-3">
              <Link href={`/${language}/clubs`} className="block w-full p-3 rounded-lg border border-white/5 bg-bg-base/40 hover:bg-bg-surface/60 hover:border-brand/30 transition-all text-left group">
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-1">{t('safety_kit.dl_cta1')}</span>
                <span className="flex items-center text-sm text-brand group-hover:text-brand-light">
                  {t('safety_kit.dl_cta1_btn')}
                </span>
              </Link>
              
              <Link href={`/${language}/editorial/legal`} className="block w-full p-3 rounded-lg border border-white/5 bg-bg-base/40 hover:bg-bg-surface/60 hover:border-brand/30 transition-all text-left group">
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-1">{t('safety_kit.dl_cta2')}</span>
                <span className="flex items-center text-sm text-white group-hover:text-zinc-300">
                  {t('safety_kit.dl_cta2_btn')}
                </span>
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
