'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

export function ConciergeTools() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'timeline',
      question: t('landing.concierge_tools.questions.timeline.question'),
      options: [
        t('landing.concierge_tools.questions.timeline.options.this_weekend'),
        t('landing.concierge_tools.questions.timeline.options.within_month'),
        t('landing.concierge_tools.questions.timeline.options.few_months'),
        t('landing.concierge_tools.questions.timeline.options.already_here'),
      ]
    },
    {
      id: 'experience',
      question: t('landing.concierge_tools.questions.experience.question'),
      options: [
        t('landing.concierge_tools.questions.experience.options.beginner'),
        t('landing.concierge_tools.questions.experience.options.coffeeshops'),
        t('landing.concierge_tools.questions.experience.options.been_before'),
        t('landing.concierge_tools.questions.experience.options.member_somewhere'),
      ]
    },
    {
      id: 'city',
      question: t('landing.concierge_tools.questions.city.question'),
      options: [
        t('landing.concierge_tools.questions.city.options.barcelona'),
        t('landing.concierge_tools.questions.city.options.madrid'),
        t('landing.concierge_tools.questions.city.options.valencia'),
        t('landing.concierge_tools.questions.city.options.tenerife'),
        t('landing.concierge_tools.questions.city.options.not_sure'),
      ]
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
    const notSureOption = t('landing.concierge_tools.questions.city.options.not_sure');
    const beginnerOption = t('landing.concierge_tools.questions.experience.options.beginner');
    const city = answers.city === notSureOption ? t('landing.concierge_tools.default_city') : answers.city || t('landing.concierge_tools.default_city');
    const level = answers.experience === beginnerOption ? t('landing.concierge_tools.level.first_timer') : t('landing.concierge_tools.level.experienced');
    return { city, level };
  };

  return (
    <section className="bg-zinc-50 py-24 md:py-32 px-4 md:px-8 overflow-hidden relative border-t border-zinc-200">
      <div className="max-w-2xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-black tracking-tight mb-4">
            {t('landing.concierge_tools.title')}
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 font-medium">
            {t('landing.concierge_tools.subtitle')}
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
                  <span className="font-bold text-sm uppercase tracking-wide">{t('landing.concierge_tools.result.ready')}</span>
                </div>
                
                <h3 className="text-2xl font-black text-zinc-900 mb-6">
                  {t('landing.concierge_tools.result.plan_prefix')} {getResult().city} - {getResult().level} {t('landing.concierge_tools.result.plan_suffix')}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{t('landing.concierge_tools.result.steps.step_1.title')}</h4>
                      <p className="text-sm text-zinc-500 mt-1">{t('landing.concierge_tools.result.steps.step_1.body')}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{t('landing.concierge_tools.result.steps.step_2.title')}</h4>
                      <p className="text-sm text-zinc-500 mt-1">{t('landing.concierge_tools.result.steps.step_2.body')}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{t('landing.concierge_tools.result.steps.step_3.title_prefix')} {getResult().city} {t('landing.concierge_tools.result.steps.step_3.title_suffix')}</h4>
                      <p className="text-sm text-zinc-500 mt-1">{t('landing.concierge_tools.result.steps.step_3.body')}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex gap-4 items-start group hover:border-[#E8A838]/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 shrink-0">4</div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{t('landing.concierge_tools.result.steps.step_4.title')}</h4>
                      <p className="text-sm text-zinc-500 mt-1">{t('landing.concierge_tools.result.steps.step_4.body')}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep(0)} className="w-full mt-4 text-sm font-bold text-zinc-400 hover:text-zinc-600">
                  {t('landing.concierge_tools.restart')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
