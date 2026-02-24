import React from 'react';
import Link from 'next/link';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { GlowingTimeline } from '../interactive/GlowingTimeline';
// import { MagneticButton } from '../interactive/MagneticButton';

export function CommunityRoadmap() {
  return (
    <SectionWrapper dark className="bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <ConciergeLabel className="text-emerald-500 mb-6 block">The Journey</ConciergeLabel>
          <EditorialHeading size="xl" className="text-white">The Path to Membership</EditorialHeading>
          <p className="text-zinc-400 text-lg mt-6">
            We build trust gravity before enabling access.
            Free knowledge stays free. Premium workflows are additive to your journey.
          </p>
        </div>

        <div className="relative">
          <GlowingTimeline />
          
          <div className="space-y-16">
            {[
              { phase: 'Phase 01', title: 'Intelligence', desc: 'Mastering the legal grey zone and safety protocols through our foundational knowledge kits.', status: 'active' },
              { phase: 'Phase 02', title: 'Verification', desc: 'Identifying associations vetted through our multi-point trust and safety framework.', status: 'future' },
              { phase: 'Phase 03', title: 'Etiquette', desc: 'Adopting local norms and community etiquette to protect the private association model.', status: 'future' },
              { phase: 'Phase 04', title: 'Workflows', desc: 'Accessing secure, end-to-end request systems designed for privacy and compliance.', status: 'future' },
            ].map((item, i) => (
              <div key={i} className={`relative md:flex md:justify-between md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Visual Dot */}
                <div className={`absolute left-6 md:left-1/2 md:-ml-1.5 w-3 h-3 rounded-full border border-black z-20 ${item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} />
                
                <div className="md:w-[45%] ml-12 md:ml-0">
                  <div className={`p-8 rounded-[2rem] border transition-colors duration-700 ${item.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                    <ConciergeLabel emphasis={item.status === 'active' ? 'high' : 'low'} className="mb-2 block">{item.phase}</ConciergeLabel>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-24 text-center">
        <Link href="/account/register" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-12 py-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 text-lg uppercase tracking-widest">
          Begin Your Evolution
        </Link>
          <p className="mt-6 text-zinc-500 text-sm italic">
            Start with the Intelligence Hub. Access is earned through education.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
