'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, UserCheck, Shield, HelpCircle, RotateCcw, Sparkles } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  desc: string;
  icon: typeof Shield;
  yesBonus: string;
  noWarning: string;
}

const questions: Question[] = [
  {
    id: 'age',
    text: 'Are you over 18 or 21 years old?',
    desc: 'Age requirements vary by club. Most require 18+, premium clubs 21+.',
    icon: UserCheck,
    yesBonus: '✓ Age requirement satisfied',
    noWarning: '✗ Underage membership not permitted',
  },
  {
    id: 'id',
    text: 'Do you have valid government-issued photo ID?',
    desc: 'Passports, EU ID cards, or driver licenses required. Digital IDs rejected.',
    icon: Shield,
    yesBonus: '✓ Identity verification possible',
    noWarning: '✗ No ID = No membership',
  },
  {
    id: 'purpose',
    text: 'Joining for therapeutic or social use?',
    desc: 'CSCs are private member associations, not retail shops. Respect the model.',
    icon: HelpCircle,
    yesBonus: '✓ Appropriate use case',
    noWarning: '✗ Commercial intent prohibited',
  },
];

export default function EligibilityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [direction, setDirection] = useState(1);

  const handleAnswer = (answer: boolean) => {
    setDirection(answer ? 1 : -1);
    setAnswers({ ...answers, [questions[step].id]: answer });
    setTimeout(() => setStep(step + 1), 300);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setDirection(1);
  };

  const isEligible = Object.values(answers).every(a => a === true);
  const progress = ((step) / questions.length) * 100;

  // Results screen
  if (step >= questions.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl shadow-xl"
      >
        <div className={`p-8 text-center ${isEligible ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
          {/* Background decoration */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30 ${isEligible ? 'bg-green-400' : 'bg-orange-400'}`} />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isEligible ? 'bg-green-500' : 'bg-orange-500'}`}
          >
            {isEligible ? (
              <CheckCircle2 className="h-10 w-10 text-white" />
            ) : (
              <XCircle className="h-10 w-10 text-white" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className={`text-3xl font-black mb-3 ${isEligible ? 'text-green-700' : 'text-orange-700'}`}>
              {isEligible ? 'You Are Eligible!' : 'Requirements Not Met'}
            </h3>
            <p className="text-zinc-600 mb-8 max-w-sm mx-auto">
              {isEligible 
                ? "Based on your answers, you meet the basic requirements to join most Cannabis Social Clubs in Spain."
                : "You may face challenges joining at this time. Review the requirements or contact clubs directly for exceptions."
              }
            </p>

            {/* Answer Summary */}
            <div className="bg-white/60 rounded-2xl p-4 mb-6 text-left">
              {questions.map((q, idx) => (
                <div key={q.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <span className="text-sm text-zinc-600">{q.text.substring(0, 30)}...</span>
                  {answers[q.id] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-3 ${
                isEligible 
                  ? 'bg-green-600 text-white hover:bg-green-500' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {isEligible ? 'View Membership Guide' : 'Read Requirements Guide'}
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            <motion.button
              onClick={restart}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mx-auto text-sm font-bold text-zinc-400 hover:text-zinc-600"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[step];
  const CurrentIcon = currentQuestion.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl shadow-xl bg-white border border-zinc-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Membership Quiz</span>
            </div>
            <span className="text-sm font-bold text-blue-100">{step + 1}/{questions.length}</span>
          </div>
          <h3 className="text-2xl font-bold">Can You Join a CSC?</h3>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-zinc-100">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question Number */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <CurrentIcon className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Question {step + 1} of {questions.length}</span>
                <h4 className="text-xl font-bold text-zinc-900 leading-tight">{currentQuestion.text}</h4>
              </div>
            </div>

            <p className="text-zinc-500 mb-8 leading-relaxed bg-zinc-50 rounded-xl p-4 border-l-4 border-blue-400">
              {currentQuestion.desc}
            </p>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={() => handleAnswer(true)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl py-6 font-bold text-lg shadow-lg shadow-green-500/25 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  Yes
                </span>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer(false)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative bg-zinc-100 text-zinc-700 rounded-2xl py-6 font-bold text-lg border-2 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-200 transition-colors overflow-hidden"
              >
                <span className="relative flex items-center justify-center gap-2">
                  <XCircle className="h-6 w-6" />
                  No
                </span>
              </motion.button>
            </div>

            {/* Hints */}
            <div className="mt-6 flex gap-4 text-xs">
              <div className="flex-1 flex items-center gap-2 text-green-600 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">{currentQuestion.yesBonus}</span>
              </div>
              <div className="flex-1 flex items-center gap-2 text-red-500 bg-red-50 rounded-lg px-3 py-2">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">{currentQuestion.noWarning}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
