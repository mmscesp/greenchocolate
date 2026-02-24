'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { PREMIUM_SPRING } from '../motion/config';

export function RotaryFineEstimator() {
  const [level, setLevel] = useState(0); // 0, 1, 2
  const dragX = useMotionValue(0);
  
  const levels = [
    { amount: '€601', label: 'Minor', risk: 'Low', color: 'text-emerald-500' },
    { amount: '€10,400', label: 'Serious', risk: 'Medium', color: 'text-amber-500' },
    { amount: '€30,000', label: 'Severe', risk: 'High', color: 'text-red-500' },
  ];

  const current = levels[level];

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        key={level}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={PREMIUM_SPRING}
        className="text-center"
      >
        <div className={cn("text-7xl font-black font-mono mb-4 transition-colors duration-500", current.color)}>
          {current.amount}
        </div>
        <ConciergeLabel emphasis="medium">Potential Administrative Penalty</ConciergeLabel>
      </motion.div>
      
      <div className="w-full max-w-sm mt-16 px-4">
        <div className="relative h-1 bg-zinc-800 rounded-full">
          {/* Snap points */}
          <div className="absolute inset-0 flex justify-between items-center -top-[1px]">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                onClick={() => setLevel(i)}
                className={cn(
                  "w-3 h-3 rounded-full border-2 border-zinc-900 transition-colors cursor-pointer",
                  i <= level ? 'bg-emerald-500' : 'bg-zinc-700'
                )} 
              />
            ))}
          </div>
          
          {/* Progress bar */}
          <motion.div 
            className="absolute left-0 h-full bg-emerald-500 rounded-full"
            animate={{ width: `${(level / 2) * 100}%` }}
            transition={PREMIUM_SPRING}
          />
          
          {/* Handle */}
          <motion.div 
            className="absolute top-1/2 -mt-4 w-8 h-8 bg-white rounded-full shadow-2xl cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
            animate={{ left: `calc(${(level / 2) * 100}% - 16px)` }}
            transition={PREMIUM_SPRING}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-1 h-3 bg-zinc-200 rounded-full" />
          </motion.div>
        </div>
        
        <div className="flex justify-between w-full mt-8">
          {levels.map((l, i) => (
            <button 
              key={i} 
              onClick={() => setLevel(i)}
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest transition-colors",
                level === i ? 'text-white' : 'text-zinc-600'
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
