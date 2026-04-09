'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionEyebrowProps {
  children: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionEyebrow({
  children,
  align = 'center',
  className,
}: SectionEyebrowProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'flex items-center gap-4',
        isCentered ? 'justify-center' : 'justify-start',
        className
      )}
    >
      <div className="h-[1px] w-8 md:w-12 bg-brand/50" />
      <div className="text-brand text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-center">
        {children}
      </div>
      {isCentered ? <div className="h-[1px] w-8 md:w-12 bg-brand/50" /> : null}
    </div>
  );
}
