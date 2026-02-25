'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      {...props}
    >
      <div
        className={cn(
          'absolute -inset-[24%] opacity-45 blur-3xl',
          showRadialGradient && '[mask-image:radial-gradient(ellipse_at_50%_10%,black_25%,transparent_75%)]'
        )}
        style={{
          backgroundImage:
            'radial-gradient(45% 60% at 20% 30%, hsl(var(--brand) / 0.34), transparent), radial-gradient(45% 60% at 80% 25%, hsl(var(--gold) / 0.3), transparent), radial-gradient(55% 70% at 50% 85%, hsl(var(--brand-light) / 0.24), transparent)',
          backgroundSize: '170% 170%',
          animation: 'aurora 26s linear infinite',
        }}
      />
    </div>
  );
}
