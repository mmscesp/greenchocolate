'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PREMIUM_SPRING } from '../motion/config';
import { ShieldCheck, AlertTriangle, MapPin } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const ICONS = {
  ShieldCheck,
  AlertTriangle,
  MapPin
};
interface AccordionItem {
  title: string;
  desc: string;
  iconName: string;
  color: string;
}
interface StickyAccordionProps {
  items: AccordionItem[];
}

export function StickyAccordion({ items }: StickyAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="grid lg:grid-cols-4 gap-4 items-stretch h-full">
      {items.map((item, i) => {
        const Icon = ICONS[item.iconName as keyof typeof ICONS] || ShieldCheck;
        const isActive = activeIndex === i;
        
        return (
          <motion.button
            key={i}
            type="button"
            layout
            onClick={() => {
              const nextOpen = isActive ? null : i;
              setActiveIndex(nextOpen);
              trackEvent('landing_reality_card_toggle', {
                title: item.title,
                opened: nextOpen === i,
              });
            }}
            aria-expanded={isActive}
            aria-label={`${item.title} details`}
            className={cn(
              'relative p-8 rounded-[2.5rem] border bg-zinc-950 flex flex-col transition-all duration-700 cursor-pointer group overflow-hidden text-left',
              isActive ? 'lg:col-span-2 border-zinc-700' : 'lg:col-span-1 border-zinc-800'
            )}
            initial={false}
            transition={PREMIUM_SPRING}
          >
            {/* Active Glow */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", item.color)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col h-full">
              <motion.div 
                layout
                className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mb-12 border border-white/5 group-hover:border-white/10 transition-colors"
              >
                <Icon className={cn(
                  "w-6 h-6 transition-colors duration-500",
                  isActive ? 'text-white' : 'text-white/40'
                )} />
              </motion.div>
              
              <motion.h3 
                layout
                className={cn(
                  "font-serif font-bold text-white transition-all duration-500",
                  isActive ? 'text-4xl mb-6' : 'text-2xl mb-4'
                )}
              >
                {item.title}
              </motion.h3>
              
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
                      {item.desc}
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Secure Intelligence Node</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-auto"
                  >
                    <p className="text-zinc-600 text-sm line-clamp-2 group-hover:text-zinc-500 transition-colors">
                      {item.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto pt-8">
                <span className={cn(
                  "font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-500",
                  isActive ? 'text-emerald-500' : 'text-zinc-700'
                )}>
                  Reality_Check.0{i+1}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
