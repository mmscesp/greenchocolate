'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { PREMIUM_SPRING } from '../motion/config';
import { Check, X, ShieldCheck, AlertCircle } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export function EligibilityFlow() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      id: 'age',
      q: t('landing.eligibility.steps.age.q'),
      desc: t('landing.eligibility.steps.age.desc'),
    },
    {
      id: 'id',
      q: t('landing.eligibility.steps.id.q'),
      desc: t('landing.eligibility.steps.id.desc'),
    },
    {
      id: 'intent',
      q: t('landing.eligibility.steps.intent.q'),
      desc: t('landing.eligibility.steps.intent.desc'),
    },
  ];

  const handleAnswer = (val: boolean) => {
    setAnswers({ ...answers, [steps[step].id]: val });
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setIsComplete(false);
  };

  return (
    <div className="w-full min-h-[320px] flex flex-col items-center justify-center px-4 sm:px-6">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={PREMIUM_SPRING}
            className="text-center w-full max-w-xs mx-auto"
          >
            {/* Step indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`
                    h-1 rounded-full transition-all duration-500
                    ${i === step ? 'w-8 bg-emerald-500' : i < step ? 'w-2 bg-emerald-500/60' : 'w-2 bg-zinc-700'}
                  `}
                />
              ))}
            </div>

            {/* Step number */}
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-emerald-400 text-lg font-bold">{step + 1}</span>
            </div>
            
            {/* Question - HIGHER CONTRAST */}
            <EditorialHeading size="md" className="text-white mb-3 leading-tight">
              {steps[step].q}
            </EditorialHeading>
            
            {/* Description - IMPROVED CONTRAST */}
            <p className="text-zinc-300 text-sm max-w-xs mx-auto mb-10 leading-relaxed">
              {steps[step].desc}
            </p>
            
            {/* Buttons - BETTER CONTRAST */}
            <div className="flex gap-3">
              <button 
                onClick={() => handleAnswer(true)}
                className="
                  flex-1 min-h-11 py-4 sm:py-5 px-4 
                  bg-emerald-600 hover:bg-emerald-500 
                  text-white font-bold rounded-2xl 
                  transition-all duration-200
                  flex items-center justify-center gap-2 
                  uppercase tracking-wide text-sm
                  shadow-lg shadow-emerald-900/20
                  border border-emerald-500/30
                "
              >
                <Check className="w-4 h-4" /> {t('landing.eligibility.yes')}
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                className="
                  flex-1 min-h-11 py-4 sm:py-5 px-4 
                  bg-zinc-700 hover:bg-zinc-600 
                  text-white font-bold rounded-2xl 
                  transition-all duration-200
                  flex items-center justify-center gap-2 
                  uppercase tracking-wide text-sm
                  border border-zinc-600
                "
              >
                <X className="w-4 h-4" /> {t('landing.eligibility.no')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...PREMIUM_SPRING, delay: 0.1 }}
            className="text-center w-full max-w-xs mx-auto"
          >
            <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            
            <EditorialHeading size="md" className="text-white mb-3">
              {t('landing.eligibility.complete_title')}
            </EditorialHeading>
            
            <p className="text-zinc-300 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
              {t('landing.eligibility.complete_description')}
            </p>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-zinc-300 text-xs text-left">
                  {t('landing.eligibility.warning')}
                </p>
              </div>
            </div>
            
            <button 
              onClick={reset}
              className="
                text-zinc-400 hover:text-white 
                transition-colors 
                font-mono text-[10px] uppercase tracking-widest
                hover:underline underline-offset-4
              "
            >
              {t('landing.eligibility.restart')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
