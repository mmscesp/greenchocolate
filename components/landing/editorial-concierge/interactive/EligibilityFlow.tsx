'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { PREMIUM_SPRING } from '../motion/config';
import { Check, X, ShieldCheck } from 'lucide-react';

const STEPS = [
  { 
    id: 'age', 
    q: 'Are you over 18 or 21 years old?', 
    desc: 'Age requirements vary by club. Most require 18+, premium clubs 21+.' 
  },
  { 
    id: 'id', 
    q: 'Do you have valid government photo ID?', 
    desc: 'Passports or EU ID cards required. Digital versions are rejected.' 
  },
  { 
    id: 'intent', 
    q: 'Joining for therapeutic or social use?', 
    desc: 'Associations are not shops. Commercial intent is prohibited.' 
  },
];

export function EligibilityFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (val: boolean) => {
    setAnswers({ ...answers, [STEPS[step].id]: val });
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={PREMIUM_SPRING}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mx-auto mb-8">
              <span className="font-serif text-emerald-500 text-xl">{step + 1}</span>
            </div>
            <EditorialHeading size="sm" className="mb-4">{STEPS[step].q}</EditorialHeading>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-12">
              {STEPS[step].desc}
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => handleAnswer(true)}
                className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                <Check className="w-3 h-3" /> Yes
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                className="flex-1 py-5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                <X className="w-3 h-3" /> No
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <EditorialHeading size="md" className="mb-4">Eligibility Verified</EditorialHeading>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-10">
              You meet the primary preparedness requirements for Spanish association membership.
            </p>
            <button 
              onClick={() => { setStep(0); setIsComplete(false); }}
              className="text-zinc-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest"
            >
              Restart Screening
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isComplete && (
        <div className="absolute bottom-0 flex gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-1 h-1 rounded-full transition-all duration-500",
                i === step ? 'w-4 bg-emerald-500' : 'bg-zinc-800'
              )} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
