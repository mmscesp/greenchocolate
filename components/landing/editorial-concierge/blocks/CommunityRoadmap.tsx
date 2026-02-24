import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { GlowingTimeline } from '../interactive/GlowingTimeline';

export function CommunityRoadmap() {
  return (
    <SectionWrapper dark className="bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <ConciergeLabel className="text-emerald-500 mb-6 block">Evolution</ConciergeLabel>
          <EditorialHeading size="xl" className="text-white">Barcelona Launch Roadmap</EditorialHeading>
          <p className="text-zinc-400 text-lg mt-6">
            We are building trust gravity before publishing inventory. 
            Free knowledge stays free. Premium workflows are additive.
          </p>
        </div>

        <div className="relative">
          <GlowingTimeline />
          
          <div className="space-y-16">
            {[
              { date: 'March 2026', title: 'Community Foundation', desc: 'Launch of the weekly intelligence drop and the master safety kit.', status: 'active' },
              { date: 'April 2026', title: 'Verified Directory', desc: 'First 20-40 Barcelona clubs published with multi-point verification.', status: 'future' },
              { date: 'Q2 2026', title: 'Expansion', desc: 'Rolling out to Madrid and Valencia with local culture hubs.', status: 'future' },
              { date: 'Q3 2026', title: 'Private Workflows', desc: 'Secure, end-to-end membership request systems behind TOS.', status: 'future' },
            ].map((item, i) => (
              <div key={i} className={`relative md:flex md:justify-between md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Visual Dot */}
                <div className={`absolute left-6 md:left-1/2 md:-ml-1.5 w-3 h-3 rounded-full border border-black z-20 ${item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} />
                
                <div className="md:w-[45%] ml-12 md:ml-0">
                  <div className={`p-8 rounded-[2rem] border transition-colors duration-700 ${item.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                    <ConciergeLabel emphasis={item.status === 'active' ? 'high' : 'low'} className="mb-2 block">{item.date}</ConciergeLabel>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
