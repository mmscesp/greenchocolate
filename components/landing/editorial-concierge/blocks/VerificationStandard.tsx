'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight } from '@/lib/icons';
import ClubCard from '@/components/ClubCard';
import { getClubBySlug, type ClubDetail } from '@/app/actions/clubs';

export function VerificationStandard() {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [featuredClub, setFeaturedClub] = useState<ClubDetail | null>(null);
  
  useEffect(() => {
    async function loadFeaturedClub() {
      const club = await getClubBySlug('club-311-barcelona');
      setFeaturedClub(club);
    }
    loadFeaturedClub();
  }, []);

  const verificationChecks = [
    t('landing.verification.list.verify.1'),
    t('landing.verification.list.verify.2'),
    t('landing.verification.list.verify.3'),
    t('landing.verification.list.verify.4'),
  ];

  return (
    <section className="bg-bg-base py-16 md:py-24 px-4 md:px-8 border-t border-white/5 relative z-10 flex items-center lg:min-h-[80vh]">
      {/* Subtle background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)/0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column: The Standard (Strict Typography, No Boxes) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between h-full w-full max-w-xl"
          >
            <div>
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="h-[1px] w-8 bg-brand" />
                <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-brand">
                  {t('landing.verification.what_we_verify') || "The Standard"}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black font-serif text-white tracking-tight leading-[1.05] mb-6">
                {t('landing.verification_standard.title')}
              </h2>
              <p className="text-lg text-white/50 font-serif italic mb-12 md:mb-16 leading-relaxed">
                {t('landing.verification_standard.subtitle')}
              </p>
            </div>

            {/* Sleek, dense typographic list. No boxes. No icons. */}
            <div className="flex flex-col gap-6 md:gap-8 border-l border-white/10 pl-6 md:pl-8 relative mt-auto">
              {/* Progress Line */}
              <div className="absolute top-0 left-0 w-[1px] h-1/2 bg-gradient-to-b from-brand to-transparent" />
              
              {verificationChecks.map((item, idx) => (
                <div key={idx} className="group/item relative">
                  <span className="absolute -left-[38px] md:-left-[46px] top-0.5 text-[10px] font-mono text-white/20 group-hover/item:text-brand transition-colors duration-300">
                    0{idx + 1}
                  </span>
                  <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed group-hover/item:text-white transition-colors duration-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-16 pt-8 border-t border-white/5">
              <Link
                href={`/${language}/clubs`}
                className="group/link inline-flex items-center gap-4 text-xs font-bold text-white uppercase tracking-[0.2em] transition-all hover:text-brand"
              >
                <span>{t('landing.verification_standard.view_full_directory')}</span>
                <div className="w-8 h-[1px] bg-white/20 group-hover/link:bg-brand group-hover/link:w-12 transition-all duration-300 relative">
                   <ArrowRight className="absolute -right-1 -top-[5px] w-3 h-3 transform translate-x-0 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Featured Club Showcase */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0"
          >
            <div className="w-full max-w-md relative h-full">
              {featuredClub ? (
                <div className="h-full relative group/showcase transform transition-transform duration-700 hover:-translate-y-2">
                  {/* Premium Technical Badge */}
                  <div className="absolute -top-3 -right-3 md:-right-6 z-20">
                    <div className="bg-brand text-black font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      Verified Showcase
                    </div>
                  </div>
                  
                  <ClubCard club={featuredClub} className="h-full shadow-2xl shadow-black/40" />
                </div>
              ) : (
                // High-fidelity Skeleton
                <div className="h-full min-h-[500px] bg-bg-surface border border-white/5 rounded-[2rem] animate-pulse overflow-hidden flex flex-col">
                  <div className="h-56 sm:h-64 bg-white/[0.02] w-full" />
                  <div className="p-6 sm:p-8 flex-1 flex flex-col gap-4">
                    <div className="h-6 bg-white/[0.03] rounded w-2/3" />
                    <div className="h-3 bg-white/[0.02] rounded w-1/3 mb-4" />
                    <div className="h-12 bg-white/[0.02] rounded w-full" />
                    <div className="mt-auto h-12 bg-white/[0.03] rounded-full w-full" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
