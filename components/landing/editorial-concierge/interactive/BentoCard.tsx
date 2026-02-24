'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PREMIUM_SPRING, IMAGE_ZOOM } from '../motion/config';

interface BentoCardProps {
  title: string;
  desc: string;
  imageSrc?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function BentoCard({ title, desc, imageSrc, size = 'small', className }: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={cn(
        "group relative overflow-hidden rounded-[2rem] bg-zinc-100 border border-zinc-200 p-8 flex flex-col justify-end transition-colors duration-500",
        size === 'large' && 'col-span-2 row-span-1 md:row-span-2',
        size === 'medium' && 'col-span-2 row-span-1',
        isHovered ? 'bg-zinc-50 border-zinc-300 shadow-2xl shadow-zinc-200/50' : 'bg-zinc-100',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      whileTap={{ scale: 0.98 }}
      transition={PREMIUM_SPRING}
    >
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-zinc-200"
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          variants={IMAGE_ZOOM}
        >
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
          )}
        </motion.div>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent z-10 transition-opacity duration-500",
          isHovered ? 'opacity-100' : 'opacity-0'
        )} />
      </div>
      
      <div className="relative z-20">
        <motion.h3 
          className={cn(
            "font-serif font-bold transition-colors duration-500",
            isHovered ? 'text-white' : 'text-zinc-900',
            size === 'large' ? 'text-3xl md:text-5xl mb-3' : 'text-xl md:text-2xl mb-2'
          )}
          animate={{ y: isHovered ? 0 : 4 }}
          transition={PREMIUM_SPRING}
        >
          {title}
        </motion.h3>
        
        <AnimatePresence>
          {isHovered && (
            <motion.p 
              className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ ...PREMIUM_SPRING, delay: 0.05 }}
            >
              {desc}
            </motion.p>
          )}
        </AnimatePresence>
        
        {!isHovered && (
          <motion.div 
            className="w-8 h-1 bg-emerald-500/30 rounded-full"
            layoutId={`indicator-${title}`}
          />
        )}
      </div>
    </motion.div>
  );
}
