'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREMIUM_SPRING } from '../motion/config';
import { Check, X, ShieldCheck, Download, ArrowRight, AlertTriangle } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SafetyKitFunnel() {
  const { t, lang } = useLanguage();
  
  // States: 'email' -> 'age_gate' -> 'download' | 'rejected'
  const [step, setStep] = useState<'email' | 'age_gate' | 'download' | 'rejected'>('email');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call for email submission
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('age_gate');
    }, 600);
  };

  const handleAgeAnswer = (isAdult: boolean) => {
    if (isAdult) {
      setStep('download');
    } else {
      setStep('rejected');
    }
  };

  return (
    <div className="w-full relative min-h-[280px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-md shadow-2xl overflow-hidden">
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
                type="email"
                placeholder={t('safety_kit.form_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-black/50 border-white/10 focus-visible:ring-[#E8A838]/50 text-white placeholder:text-zinc-500 rounded-xl"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 bg-[#E8A838] hover:bg-[#d4962e] text-black font-bold rounded-xl transition-all duration-200 text-sm uppercase tracking-wide w-full"
              >
                {isSubmitting ? '...' : t('safety_kit.form_button')}
              </Button>
            </form>
            <p className="mt-4 text-[11px] text-zinc-500 max-w-xs mx-auto">
              {t('safety_kit.microcopy')}
            </p>
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
              <button 
                onClick={() => handleAgeAnswer(true)}
                className="flex-1 min-h-[48px] py-3 px-4 bg-[#E8A838] hover:bg-[#d4962e] text-black font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-[#E8A838]/20 border border-[#E8A838]/30"
              >
                {t('safety_kit.age_yes')}
              </button>
              <button 
                onClick={() => handleAgeAnswer(false)}
                className="flex-none min-h-[48px] py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-zinc-700"
              >
                {t('safety_kit.age_no')}
              </button>
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
            <button 
              onClick={() => setStep('email')}
              className="mt-6 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest underline underline-offset-4"
            >
              Start Over
            </button>
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
            
            <Button 
              className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm mb-4"
            >
              <Download className="w-4 h-4" />
              {t('safety_kit.dl_button')}
            </Button>
            
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              {t('safety_kit.dl_support')}
            </p>
            
            <div className="space-y-3">
              <Link href={`/${lang}/directory`} className="block w-full p-3 rounded-lg border border-white/5 bg-black/30 hover:bg-black/50 hover:border-[#E8A838]/30 transition-all text-left group">
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-1">{t('safety_kit.dl_cta1')}</span>
                <span className="flex items-center text-sm text-[#E8A838] group-hover:text-[#f3c162]">
                  {t('safety_kit.dl_cta1_btn')}
                </span>
              </Link>
              
              <Link href={`/${lang}/editorial/legal`} className="block w-full p-3 rounded-lg border border-white/5 bg-black/30 hover:bg-black/50 hover:border-[#E8A838]/30 transition-all text-left group">
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
