'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { AuroraBackground } from '@/components/ui/aurora-background';

interface AtmosphericCanvasProps {
  className?: string;
  children?: React.ReactNode;
  fixed?: boolean;
}

export function AtmosphericCanvas({ className, children, fixed = false }: AtmosphericCanvasProps) {
  return (
    <section
      className={cn(
        fixed
          ? 'fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none'
          : 'relative overflow-hidden bg-background',
        className
      )}
    >
      <AuroraBackground className="opacity-90" showRadialGradient />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(5, 11, 10, 0.06) 0%, rgba(5, 11, 10, 0) 22%), radial-gradient(70% 90% at 50% 0%, rgba(212, 168, 83, 0.08), transparent 65%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundSize: '220px 220px',
        }}
      />

      {children ? <div className="relative z-10">{children}</div> : null}
    </section>
  );
}
