'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
// import { MagneticButton } from '../interactive/MagneticButton';
import { ArrowRight, BookOpen, ShieldAlert, Heart } from '@/lib/icons';
import { trackEvent } from '@/lib/analytics';

type OnrampExperimentArm = 'control' | 'benefit';

interface BeginnersOnrampProps {
  experimentArm?: OnrampExperimentArm;
}

export function BeginnersOnramp({ experimentArm = 'control' }: BeginnersOnrampProps) {
  const heading =
    experimentArm === 'benefit'
      ? 'Avoid mistakes. Stay safe. Start here.'
      : 'First time smoking weed? Start here.';

  const description =
    experimentArm === 'benefit'
      ? 'Get the essentials fast: legal boundaries, etiquette, and harm-reduction basics so your first experience stays safe and respectful.'
      : "Navigating Barcelona's social clubs requires respect, discretion, and preparation. Follow our safety-first guide for a seamless introduction to the culture.";

  return (
    <SectionWrapper className="bg-white">
      <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24 items-center">
        {/* Left Side: Curated Path */}
        <div className="space-y-12">
          <div>
            <ConciergeLabel className="text-emerald-600 mb-6">New Member Onboarding</ConciergeLabel>
            <EditorialHeading size="xl" className="mb-8">{heading}</EditorialHeading>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Legal Framework', desc: 'Public vs Private: understanding the grey zone.', icon: ShieldAlert, href: '/editorial/legal' },
              { title: 'Club Etiquette', desc: 'The unwritten rules of association membership.', icon: Heart, href: '/editorial/etiquette' },
              { title: 'Harm Reduction', desc: 'Onset times, dosing, and responsible choices.', icon: BookOpen, href: '/safety' },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="block"
                onClick={() => {
                  trackEvent('landing_onramp_topic_click', {
                    topic: item.title,
                    destination: item.href,
                  });
                }}
              >
                <motion.div
                  className="group relative flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-[2rem] bg-zinc-50/50 border border-zinc-200/50 transition-all duration-500 hover:border-emerald-500/30 hover:bg-zinc-50 overflow-hidden"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                {/* Ambient Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 group-hover:opacity-100 transition-all duration-500 -z-10" />

                <div className="relative w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors duration-500 z-10">
                  <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-600 transition-colors duration-500" />
                </div>
                <div className="flex-1 relative z-10">
                  <h4 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors duration-500">{item.title}</h4>
                  <p className="text-sm text-zinc-500 mt-1 transition-colors duration-500 group-hover:text-zinc-700">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-500 relative z-10 mt-1" />

                {/* Expanding Accent Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-1/3 transition-all duration-500 z-20" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Editorial Teaser */}
        <motion.div 
          className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-zinc-200/50"
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 rounded-[3rem] blur-xl opacity-0 group-hover:from-emerald-500/15 group-hover:to-teal-500/15 group-hover:opacity-100 transition-all duration-500 -z-10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
          {/* Image Placeholder */}
          <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-1000 z-0" />
          
          <div className="absolute inset-0 z-20 p-6 sm:p-8 lg:p-12 flex flex-col justify-end items-start text-left pointer-events-none">
            <ConciergeLabel emphasis="high" className="mb-4">The Experience</ConciergeLabel>
            <EditorialHeading size="lg" className="text-white mb-6">What does it feel like to be high?</EditorialHeading>
            <p className="text-white/70 text-lg mb-8 max-w-sm">
              Stay highly informed. A detailed harm-reduction explainer on effects, anxiety, and safer decision making.
            </p>
            <Link
              href="/safety"
              className="pointer-events-auto min-h-11 w-full sm:w-auto bg-white text-black font-bold px-6 sm:px-10 py-3 sm:py-5 rounded-full hover:bg-emerald-50 transition-colors duration-500 flex items-center justify-center gap-3 group/btn"
              onClick={() => {
                trackEvent('landing_onramp_read_guide_click', {
                  destination: '/safety',
                });
              }}
            >
              Read the Guide
              <ArrowRight className="w-4 h-4 text-black/40 group-hover/btn:text-emerald-600 group-hover/btn:translate-x-1 transition-all duration-500" />
            </Link>
          </div>

          {/* Expanding Accent Line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-1/3 transition-all duration-500 z-20 pointer-events-none" />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
