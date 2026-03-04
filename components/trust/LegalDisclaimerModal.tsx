'use client';

import { useCallback, useId, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertOctagon, Check, X } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export default function LegalDisclaimerModal() {
  const { t } = useLanguage();
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

  const isOpen = useSyncExternalStore(
    subscribeToConsent,
    () => !localStorage.getItem('legal_consent_v1'),
    () => false,
  );
  const [hasAgreed, setHasAgreed] = useState(false);
  const idSeed = useId();
  const sessionId = idSeed.replace(/[^a-zA-Z0-9]/g, '').slice(-8).padStart(8, '0');

  const handleAgree = () => {
    setHasAgreed(true);
    setTimeout(() => {
      localStorage.setItem('legal_consent_v1', 'true');
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
          className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden relative"
          >
            {/* Warning Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />
            
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-foreground" />
                </div>
                
                <h2 className="text-2xl font-serif font-bold mb-3 tracking-tight">
                  {t('trust.legal_modal.title')}
                </h2>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('trust.legal_modal.intro')}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-left text-muted-foreground">
                    <span className="font-semibold text-foreground block mb-1">{t('trust.legal_modal.warning_title')}</span>
                    {t('trust.legal_modal.warning_body')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="h-12 border-destructive/20 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('trust.legal_modal.exit')}
                </Button>
                
                <Button 
                  onClick={handleAgree}
                  className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all relative overflow-hidden"
                >
                  {hasAgreed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-emerald-600"
                    >
                      <Check className="mr-2 h-5 w-5" />
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
