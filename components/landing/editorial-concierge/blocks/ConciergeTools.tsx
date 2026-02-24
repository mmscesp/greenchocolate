import React from 'react';
import Link from 'next/link';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { RotaryFineEstimator } from '../interactive/RotaryFineEstimator';
import { EligibilityFlow } from '../interactive/EligibilityFlow';
import { Calculator, ClipboardCheck } from 'lucide-react';

export function ConciergeTools() {
  return (
    <SectionWrapper className="bg-zinc-900 text-white" dark>
      <div className="text-center mb-20">
        <ConciergeLabel className="text-emerald-500 mb-6 block">Precision Intelligence</ConciergeLabel>
        <EditorialHeading size="xl" className="text-white">Know Before You Go</EditorialHeading>
        <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto">
          Two essential concierge tools to verify your preparedness and understand the real legal landscape.
          <br /><span className="text-zinc-600 text-sm mt-4 inline-block">Educational only. Not legal advice.</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Tool A: Fine Estimator */}
        <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-white/5 bg-gradient-to-br from-red-500/10 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-5 h-5 text-red-500" />
              <ConciergeLabel emphasis="high">Risk Radar: Fine Estimator</ConciergeLabel>
            </div>
            <EditorialHeading size="md" className="text-white">The Cost of Ignorance</EditorialHeading>
          </div>
          
          <div className="p-10 flex-1 flex flex-col items-center justify-center min-h-[350px]">
            <RotaryFineEstimator />
          </div>
          
          <div className="p-10 pt-0">
            <Link href="/editorial/legal" className="block w-full py-5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-colors uppercase tracking-widest text-xs text-center">
              Read the Legal Basics
            </Link>
          </div>
        </div>

        {/* Tool B: Eligibility Flow */}
        <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardCheck className="w-5 h-5 text-emerald-500" />
              <ConciergeLabel emphasis="high">Preparedness Screening</ConciergeLabel>
            </div>
            <EditorialHeading size="md" className="text-white">Eligibility Protocol</EditorialHeading>
          </div>
          
          <div className="p-10 flex-1 flex flex-col items-center justify-center min-h-[350px]">
            <EligibilityFlow />
          </div>
          
          <div className="p-10 pt-0 grid grid-cols-1">
             <ConciergeLabel size="xs" emphasis="low" className="text-center opacity-50 mb-4 italic">Result generated after screening</ConciergeLabel>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
