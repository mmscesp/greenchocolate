'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, UserCheck, Shield, HelpCircle, RotateCcw, Sparkles, Mail, Fingerprint, Scale, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  {
    id: 'conduct',
    text: 'Do you agree to the Code of Conduct?',
    desc: 'Members must respect the privacy of the club and other members.',
    icon: Scale,
    yesBonus: '✓ Ethical alignment',
    noWarning: '✗ Non-compliance is a hard rejection',
  },
];

export default function EligibilityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setDirection(answer ? 1 : -1);
    setAnswers({ ...answers, [questions[step].id]: answer });
    setTimeout(() => setStep(step + 1), 300);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCertificate(true);
    }, 1500);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setDirection(1);
    setEmail('');
    setShowCertificate(false);
  };

  const isEligible = Object.values(answers).every(a => a === true);
  const progress = ((step) / questions.length) * 100;

  // Certificate Screen
  if (showCertificate && isEligible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl bg-midnight-charcoal border-2 border-primary/30 p-8 text-center"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <FileCheck className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-3xl font-serif text-white mb-2">Verified Safety Pass</h3>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Barcelona 2026 • Legal Compliance</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 text-left relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <Fingerprint className="w-16 h-16 text-white" />
          </div>
          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Member Status</p>
              <p className="text-primary font-bold">ELIGIBILITY VERIFIED</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Verification ID</p>
              <p className="text-white font-mono text-xs">SMC-2026-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Registered Email</p>
              <p className="text-white text-sm">{email}</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-8 italic">
          "This pass confirms your understanding of the legal framework and your commitment to the CSC Code of Conduct."
        </p>

        <Button className="w-full py-8 bg-primary text-primary-foreground font-bold rounded-xl text-lg uppercase tracking-widest hover:bg-primary/90">
          Access Member Directory
        </Button>
      </motion.div>
    );
  }

  // Lead Capture Screen
  if (step >= questions.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl shadow-xl bg-midnight-charcoal border border-white/10 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-2xl font-serif text-white mb-2">Secure Your Results</h3>
          <p className="text-muted-foreground">
            {isEligible 
              ? "You've passed the initial screening. Enter your email to receive your Verified Safety Pass and access the directory."
              : "We need to send you a detailed guide on how to meet the requirements."}
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10 text-white py-6 rounded-xl focus:ring-primary"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-6 bg-primary text-primary-foreground font-bold rounded-xl uppercase tracking-widest"
          >
            {isSubmitting ? 'Processing...' : 'Generate My Pass'}
          </Button>
        </form>

        <p className="text-[10px] text-center text-muted-foreground mt-6 uppercase tracking-tighter">
          AES-256 Encrypted • Privacy Guaranteed • No Spam
        </p>
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
      className="relative overflow-hidden rounded-3xl shadow-2xl bg-midnight-charcoal border border-white/5"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-midnight-charcoal p-8 text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Membership Protocol</span>
            </div>
            <span className="text-xs font-mono text-primary">{step + 1} / {questions.length}</span>
          </div>
          <h3 className="text-3xl font-serif">Eligibility Screening</h3>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/5">
        <motion.div 
          className="h-full bg-primary"
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
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <CurrentIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-serif text-white leading-tight">{currentQuestion.text}</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed bg-white/5 rounded-xl p-5 border border-white/5">
                {currentQuestion.desc}
              </p>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer(true)}
                className="py-8 bg-primary text-primary-foreground font-bold rounded-xl text-lg uppercase tracking-widest hover:bg-primary/90"
              >
                <CheckCircle2 className="h-6 w-6 mr-2" />
                Yes
              </Button>

              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                className="py-8 border-white/10 text-white font-bold rounded-xl text-lg uppercase tracking-widest hover:bg-white/5"
              >
                <XCircle className="h-6 w-6 mr-2" />
                No
              </Button>
            </div>

            {/* Hints */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2 text-primary/60">
                <CheckCircle2 className="h-3 w-3" />
                <span>{currentQuestion.yesBonus}</span>
              </div>
              <div className="flex items-center gap-2 text-destructive/60">
                <XCircle className="h-3 w-3" />
                <span>{currentQuestion.noWarning}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
