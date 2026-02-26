'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
// Removed unused motion config

interface BentoCardProps {
  title: string;
  desc: string;
  imageSrc?: string;
  href?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function BentoCard({ title, desc, imageSrc, href = '/editorial', size = 'small', className }: BentoCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={href}
      className="block"
      onClick={() => {
        trackEvent('landing_topic_card_click', {
          title,
          destination: href,
          size,
        });
      }}
    >
      <motion.div
        className={cn(
          'group relative overflow-hidden rounded-[2rem] p-8 flex flex-col justify-end',
          size === 'large' && 'col-span-2 row-span-1 md:row-span-2',
          size === 'medium' && 'col-span-2 row-span-1',
          className
        )}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
      {/* Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 group-hover:opacity-100 transition-all duration-500 -z-10" />

      {/* Inner Card Frame */}
      <div className="absolute inset-0 bg-card border border-zinc-200/50 rounded-[2rem] transition-all duration-500 group-hover:border-emerald-500/30 group-hover:bg-muted" />
      {/* Background Image Wrapper */}
      <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] z-0 overflow-hidden mix-blend-multiply opacity-40">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent z-10" />
      </div>
      {/* Content */}
      <div className="relative z-20">
        <h3 className={cn(
            "font-serif font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors duration-500",
            size === 'large' ? 'text-3xl md:text-4xl mb-3' : 'text-xl md:text-2xl mb-2'
          )}
        >
          {title}
        </h3>
        
        <p className="text-zinc-500 text-sm md:text-base leading-relaxed line-clamp-2 transition-colors duration-500 group-hover:text-zinc-700">
          {desc}
        </p>
      </div>
      {/* Expanding Accent Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-1/3 transition-all duration-500 z-20" />
      </motion.div>
    </Link>
  );
}
