import React from 'react';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { PulsingStatusDot } from '../interactive/PulsingStatusDot';

export function TrustStrip() {
  return (
    <div className="sticky top-0 z-50 w-full h-12 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <PulsingStatusDot />
            <ConciergeLabel size="xs" emphasis="high">Status: Verified</ConciergeLabel>
          </div>
          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
            <ConciergeLabel size="xs">Last Audit: Feb 2026</ConciergeLabel>
            <ConciergeLabel size="xs" className="text-emerald-500/80">• Education First</ConciergeLabel>
            <ConciergeLabel size="xs" className="text-emerald-500/80">• Privacy Always</ConciergeLabel>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-500">
          <ConciergeLabel size="xs">We do not broker access</ConciergeLabel>
        </div>
      </div>
    </div>
  );
}
