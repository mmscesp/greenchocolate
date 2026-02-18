'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertOctagon, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LegalDisclaimerModal() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return !localStorage.getItem('legal_consent_v1');
  });
  const [hasAgreed, setHasAgreed] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') {
      return 'INIT';
    }

    return crypto.randomUUID().slice(0, 8);
  });

  const handleAgree = () => {
    setHasAgreed(true);
    setTimeout(() => {
      localStorage.setItem('legal_consent_v1', 'true');
      setIsOpen(false);
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
            className="max-w-md w-full bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden relative"
          >
            {/* Warning Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />
            
            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-foreground" />
                </div>
                
                <h2 className="text-2xl font-serif font-bold mb-3 tracking-tight">
                  Legal Compliance Check
                </h2>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This platform provides educational content about Cannabis Social Clubs in Spain. 
                  We do not sell cannabis. Access is restricted to adults (18+) under Spanish Law 
                  (Ley Orgánica 4/2015).
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                  <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-left text-muted-foreground">
                    <span className="font-semibold text-foreground block mb-1">Strict Regulatory Warning</span>
                    Public consumption is illegal in Spain (fines start at €601). 
                    This site is for informational purposes only.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="h-12 border-destructive/20 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="mr-2 h-4 w-4" />
                  Exit Site
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
                      Verified
                    </motion.div>
                  ) : (
                    <>
                      I am 18+ & Agree
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-[10px] text-center text-muted-foreground/50 mt-6 font-mono">
                ID: {sessionId} • SECURE CONNECTION
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
