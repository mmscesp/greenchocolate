'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function TrustStrip() {
  const { t } = useLanguage();
  const phrases = [
    t('landing.trust_strip.items.independent_unsponsored'),
    t('landing.trust_strip.items.verified_only'),
    t('landing.trust_strip.items.no_walk_in_referrals'),
    t('landing.trust_strip.items.updated_weekly'),
    t('landing.trust_strip.items.free_to_read'),
    t('landing.trust_strip.items.written_from_spain'),
    t('landing.trust_strip.items.zero_paid_placements'),
  ];

  return (
    <div className="w-full h-12 md:h-14 bg-bg-surface overflow-hidden flex items-center border-y border-white/5 relative z-40 select-none">
      {/* Desktop View */}
      <div className="hidden lg:flex items-center justify-center w-full max-w-7xl mx-auto gap-4 xl:gap-6 px-4">
        {phrases.map((phrase, i) => (
          <React.Fragment key={i}>
            <span className="text-[10px] xl:text-[11px] font-semibold uppercase tracking-wider text-gold/80 whitespace-nowrap">
              {phrase}
            </span>
            {i < phrases.length - 1 && (
              <span className="text-white/30 text-xs">&middot;</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile/Tablet Marquee */}
      <div className="lg:hidden flex items-center w-full relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* We duplicate the array multiple times to ensure seamless infinite scrolling */}
          {[...phrases, ...phrases, ...phrases, ...phrases].map((phrase, i) => (
            <React.Fragment key={i}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/80 mx-3 sm:mx-4">
                {phrase}
              </span>
              <span className="text-white/30 text-xs mx-1">&middot;</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
