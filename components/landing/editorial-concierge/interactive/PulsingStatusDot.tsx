'use client';

import { motion } from 'framer-motion';

interface PulsingStatusDotProps {
  color?: string;
}

export function PulsingStatusDot({ color = '#10b981' }: PulsingStatusDotProps) {
  const glow = `0 0 8px ${color}`;

  return (
    <div className="relative flex items-center justify-center w-2 h-2">
      <motion.span 
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ 
          scale: [1, 1.8, 1],
          opacity: [1, 0, 1] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      />
      <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: glow }} />
    </div>
  );
}
