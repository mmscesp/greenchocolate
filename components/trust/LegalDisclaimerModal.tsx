'use client';

import { useCallback, useEffect, useId, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Shield, AlertOctagon, X } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const CONSENT_KEY = 'legal_consent_v1';
const MODAL_DELAY_MS = 1500;

export default function LegalDisclaimerModal() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const subscribeToConsent = useCallback((onStoreChange: () => void) => {
    const onConsentUpdate = () => {
      onStoreChange();
    };

    window.addEventListener('storage', onConsentUpdate);
    window.addEventListener('legal-consent-updated', onConsentUpdate);

    return () => {
      window.removeEventListener('storage', onConsentUpdate);
      window.removeEventListener('legal-consent-updated', onConsentUpdate);
    };
  }, []);

  const requiresConsent = useSyncExternalStore(
    subscribeToConsent,
    () => !localStorage.getItem(CONSENT_KEY),
    () => false,
  );
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isDelayComplete, setIsDelayComplete] = useState(false);
  const idSeed = useId();
  const sessionId = idSeed.replace(/[^a-zA-Z0-9]/g, '').slice(-8).padStart(8, '0');
  const isOpen = requiresConsent && isDelayComplete;

  useEffect(() => {
    if (!requiresConsent) return;

    const timeoutId = window.setTimeout(() => {
      setIsDelayComplete(true);
    }, MODAL_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [requiresConsent]);

  const handleAgree = () => {
    setHasAgreed(true);

    window.setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, 'true');
      window.dispatchEvent(new Event('legal-consent-updated'));
      setHasAgreed(false);
    }, 800);
  };

  const handleDecline = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(circle_at_top,_hsl(var(--brand)/0.22),_transparent_42%),linear-gradient(180deg,hsl(var(--background)/0.72),hsl(var(--background)/0.96))] p-4 backdrop-blur-xl"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-brand/20 bg-card/95 shadow-[0_24px_80px_-32px_hsl(var(--brand)/0.45)]"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-brand via-brand/70 to-brand" />
            
            <div className="p-6 sm:p-8">
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand/20 bg-brand/10 shadow-inner shadow-brand/10">
                  <Shield className="h-8 w-8 text-brand" />
                </div>
                
                <h2 className="text-2xl font-serif font-bold mb-3 tracking-tight">
                  {t('trust.legal_modal.title')}
                </h2>
                
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {t('trust.legal_modal.intro')}
                </p>
              </div>

              <div className="mb-8 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand/[0.06] p-4">
                  <AlertOctagon className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div className="text-xs text-left text-muted-foreground">
                    <span className="font-semibold text-foreground block mb-1">{t('trust.legal_modal.warning_title')}</span>
                    {t('trust.legal_modal.warning_body')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <Button 
                  variant="secondary" 
                  onClick={handleDecline}
                  className="h-12 rounded-xl border border-border/60 bg-background/70 transition-colors hover:border-brand/30 hover:bg-brand/[0.08] hover:text-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('trust.legal_modal.exit')}
                </Button>
                
                <Button 
                  onClick={handleAgree}
                  className="relative h-12 overflow-hidden rounded-xl bg-brand text-bg-base transition-all hover:bg-brand/90"
                >
                  {hasAgreed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-emerald-600"
                    >
                      <motion.svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        />
                      </motion.svg>
                      {t('trust.legal_modal.verified')}
                    </motion.div>
                  ) : (
                    <>
                      {t('trust.legal_modal.agree')}
                    </>
                  )}
                </Button>
              </div>
              
              <p className="mt-6 break-all text-center font-mono text-[10px] text-muted-foreground/50 sm:break-normal">
                {t('trust.legal_modal.session_prefix')} {sessionId} • {t('trust.legal_modal.secure_connection')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
