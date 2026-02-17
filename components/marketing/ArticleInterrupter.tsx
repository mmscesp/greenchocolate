'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafetyKitForm from '@/components/marketing/SafetyKitForm';
import EligibilityQuiz from '@/components/marketing/EligibilityQuiz';
import { cn } from '@/lib/utils';

interface ArticleInterrupterProps {
  variant?: 'inline' | 'sidebar' | 'quiz' | 'popup' | 'sticky';
  className?: string;
}

export default function ArticleInterrupter({ 
  variant = 'inline',
  className
}: ArticleInterrupterProps) {
  const [isOpen, setIsOpen] = useState(variant === 'inline' || variant === 'quiz');
  const [isDismissed, setIsDismissed] = useState(false);

  // Legacy variants
  if (variant === 'sidebar') {
    return (
      <div className="my-8 lg:sticky lg:top-24">
        <SafetyKitForm />
      </div>
    );
  }

  if (variant === 'quiz') {
    return (
      <div className={cn("my-16 max-w-3xl mx-auto", className)}>
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Membership Access</span>
          </div>
          <h3 className="text-3xl font-serif text-white mb-3">Are You Eligible?</h3>
          <p className="text-muted-foreground">Take our 60-second screening to verify your membership potential.</p>
        </div>
        <EligibilityQuiz />
      </div>
    );
  }

  // New popup variant
  if (variant === 'popup') {
    if (isDismissed) return null;
    
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm",
              className
            )}
          >
            <div className="relative w-full max-w-lg">
              <button
                onClick={() => setIsDismissed(true)}
                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <EligibilityQuiz />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // New sticky banner variant
  if (variant === 'sticky') {
    if (isDismissed) return null;
    
    return (
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-40 bg-midnight-charcoal border-t border-white/10 p-4 shadow-2xl",
              className
            )}
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-white">Check Your Eligibility</h4>
                  <p className="text-sm text-muted-foreground">See if you qualify for private club access</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isOpen ? 'Close' : 'Start Quiz'}
                  <ArrowRight className={cn("h-4 w-4 ml-2 transition-transform", isOpen && "rotate-90")} />
                </Button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/5"
                >
                  <div className="max-w-lg mx-auto">
                    <EligibilityQuiz />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Default inline variant (embedded in article)
  return (
    <div className={cn(
      "my-12 max-w-2xl mx-auto",
      className
    )}>
      <SafetyKitForm />
    </div>
  );
}
