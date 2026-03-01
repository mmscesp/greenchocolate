'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export function ConciergeTools() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'timeline',
      question: 'When are you heading to Spain?',
      options: ['This weekend', 'Within a month', 'A few months out', 'I already live here']
    },
    {
      id: 'experience',
      question: 'What\'s your experience with Cannabis Social Clubs?',
      options: ['Complete beginner — never been', 'I\'ve visited coffeeshops', 'I\'ve been to CSCs before', 'I\'m a member somewhere']
    },
    {
      id: 'city',
      question: 'Which city are you interested in?',
      options: ['Barcelona', 'Madrid', 'Valencia', 'Tenerife', 'Not sure yet']
    }
  ];

  const handleAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [questions[step].id]: option }));
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setStep(3); // Result state
    }
  };

  // Simulate dynamic result generation
  const getResult = () => {
    const city = answers.city === 'Not sure yet' ? 'Spain' : answers.city || 'Barcelona';
    const level = answers.experience === 'Complete beginner — never been' ? 'first-timer' : 'experienced';
    return { city, level };
  };

  return (
    <section className="bg-zinc-50 py-24 md:py-32 px-4 md:px-8 overflow-hidden relative border-t border-zinc-200">
      <div className="max-w-2xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-black tracking-tight mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 font-medium">
            45 seconds. Three questions. A plan built for your trip.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-6 md:p-10 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step < 3 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex items-center gap-2 mb-8 justify-center">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#E8A838]' : i < step ? 'w-2 bg-zinc-800' : 'w-2 bg-zinc-200'}`}
                    />
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-center text-zinc-900 mb-8 leading-snug">
                  {questions[step].question}
                </h3>
                <div className="grid gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full py-4 px-6 text-left bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-[#E8A838] rounded-xl text-zinc-900 font-bold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E8A838]/50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 mb-6 text-emerald-600 bg-emerald-50 w-fit px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">Your Plan is Ready</span>
                </div>
                
                <h3 className="text-2xl font-black text-zinc-900 mb-6">
                  Your {getResult().city} plan — {getResult().level} edition
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">Read first: What CSCs Actually Are</h4>
                      <p className="text-sm text-zinc-500 mt-1">Your essential foundation.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">Read next: The Safety Kit</h4>
                      <p className="text-sm text-zinc-500 mt-1">Scam avoidance & legal boundaries.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">Browse: Verified Clubs in {getResult().city}</h4>
                      <p className="text-sm text-zinc-500 mt-1">Vetted clubs that accept visitors.</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#E8A838] hover:bg-[#d4962e] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                  Get the Full Toolkit Sent to Email
                </button>
                <button onClick={() => setStep(0)} className="w-full mt-4 text-sm font-bold text-zinc-400 hover:text-zinc-600">
                  Start Over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
