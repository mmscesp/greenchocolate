'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function PulsingStatusDot() {
  return (
    <div className="relative flex items-center justify-center w-2 h-2">
      <motion.span 
        className="absolute inset-0 rounded-full bg-emerald-500"
        animate={{ 
          scale: [1, 1.8, 1],
          opacity: [1, 0, 1] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <span className="relative w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
    </div>
  );
}
