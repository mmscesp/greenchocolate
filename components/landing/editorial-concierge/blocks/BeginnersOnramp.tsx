import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { MagneticButton } from '../interactive/MagneticButton';
import { ArrowRight, BookOpen, ShieldAlert, Heart } from 'lucide-react';

export function BeginnersOnramp() {
  return (
    <SectionWrapper className="bg-white">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left Side: Curated Path */}
        <div className="space-y-12">
          <div>
            <ConciergeLabel className="text-emerald-600 mb-6">New Member Onboarding</ConciergeLabel>
            <EditorialHeading size="xl" className="mb-8">First time smoking weed? <br />Start here.</EditorialHeading>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl">
              Navigating Barcelona's social clubs requires respect, discretion, and preparation. 
              Follow our safety-first guide for a seamless introduction to the culture.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Legal Framework', desc: 'Public vs Private: understanding the grey zone.', icon: ShieldAlert },
              { title: 'Club Etiquette', desc: 'The unwritten rules of association membership.', icon: Heart },
              { title: 'Harm Reduction', desc: 'Onset times, dosing, and responsible choices.', icon: BookOpen },
            ].map((item, i) => (
              <div key={i} className="group flex items-start gap-6 p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-zinc-200 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                  <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                  <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Editorial Teaser */}
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          {/* Image Placeholder */}
          <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-700" />
          
          <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end items-start text-left">
            <ConciergeLabel emphasis="high" className="mb-4">The Experience</ConciergeLabel>
            <EditorialHeading size="lg" className="text-white mb-6">What does it feel like to be high?</EditorialHeading>
            <p className="text-white/70 text-lg mb-8 max-w-sm">
              Stay highly informed. A detailed harm-reduction explainer on effects, anxiety, and safer decision making.
            </p>
            <MagneticButton className="bg-white text-black font-bold px-10 py-5 rounded-full hover:bg-emerald-50 transition-colors flex items-center gap-3">
              Read the Guide
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
