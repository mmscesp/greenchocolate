import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { MagneticButton } from '../interactive/MagneticButton';

export function FinalMicDrop() {
  return (
    <SectionWrapper dark className="bg-black min-h-[90vh] flex items-center justify-center text-center py-0" container={false}>
      {/* Cinematic Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="w-full h-full bg-zinc-900" />
      </div>

      <div className="relative z-20 max-w-5xl px-6">
        <ConciergeLabel emphasis="high" size="md" className="mb-8 block tracking-[0.4em]">The Standard</ConciergeLabel>
        <EditorialHeading size="2xl" className="text-white mb-12">Education first. <br />Privacy always.</EditorialHeading>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-12 py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 text-lg uppercase tracking-widest">
            Get the Visitor Safety Kit
          </MagneticButton>
          <MagneticButton className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold px-12 py-6 rounded-full transition-all hover:scale-105 active:scale-95 text-lg uppercase tracking-widest">
            Join the Weekly Drop
          </MagneticButton>
        </div>
        
        <p className="mt-16 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          EST. 2026 • BARCELONA • SOCIAL CLUBS MAPS
        </p>
      </div>
    </SectionWrapper>
  );
}
