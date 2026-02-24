'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function GlowingTimeline() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-zinc-800">
      <motion.div 
        style={{ height }}
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
      />
    </div>
  );
}
