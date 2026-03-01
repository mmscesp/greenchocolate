'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export function WhoWeAre() {
  const { language } = useLanguage();

  const pillars = [
    {
      label: "EDUCATE",
      when: "Before you travel",
      body: "How CSCs actually work — city by city, rule by rule. Legal explainers. Etiquette guides. Scam checklists. Free. Always.",
      cta: "Start with the Guides →",
      href: `/${language}/editorial`
    },
    {
      label: "VERIFY",
      when: "Before you visit",
      body: "Every listed club is personally vetted — so you don't have to guess. No paid placements. No sponsorships. No scraped listings. One at a time — because speed and trust don't live in the same sentence.",
      cta: "See the Directory →",
      href: `/${language}/clubs`
    },
    {
      label: "PROTECT",
      when: "Before anything goes wrong",
      body: "The Safety Kit covers what to say, what never to say, how to spot a scam, and what to do when things go sideways. Free. Always. Over 2,500 distributed across Europe.",
      cta: "Get the Free Safety Kit →",
      href: `/${language}/safety-kit`
    }
  ];

  return (
    <section className="bg-white py-24 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-20 md:mb-28 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black font-serif text-black tracking-tight mb-8 leading-[1.1]">
            We Got Tired of the Scams.<br />
            <span className="text-zinc-400">So We Built the Standard.</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl font-medium text-zinc-600 leading-relaxed max-w-3xl border-l-4 border-[#E8A838] pl-6 md:pl-8">
            <p>
              As locals living in Barcelona, we constantly saw visitors misled by street promoters, confused by grey-area laws, and scammed into unsafe situations. We built this platform to fix that.
            </p>
            <p>
              Every club listed here is personally vetted. Every guide is written from firsthand experience. We aren't brokers or promoters — we're a community-driven trust layer, dedicated to keeping you safe, informed, and on the right side of the rules.
            </p>
            <p className="text-black font-bold pt-2">— The SCM Team, Barcelona</p>
          </div>
        </div>

        {/* The Three Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          <div className="md:col-span-3 mb-8">
            <h3 className="text-sm font-bold tracking-[0.2em] text-zinc-400 uppercase">We Do Three Things. Nothing Else.</h3>
          </div>

          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="flex flex-col h-full group"
            >
              <div className="mb-6 pb-6 border-b-2 border-zinc-100 group-hover:border-[#E8A838] transition-colors duration-500">
                <h3 className="text-5xl md:text-6xl font-black font-serif text-zinc-900 tracking-tighter mb-2">
                  {pillar.label}
                </h3>
                <span className="text-sm font-bold uppercase tracking-widest text-[#E8A838]">
                  {pillar.when}
                </span>
              </div>
              <p className="text-base md:text-lg text-zinc-600 leading-relaxed mb-8 flex-grow font-medium">
                {pillar.body}
              </p>
              <Link
                href={pillar.href}
                className="inline-flex items-center text-black font-bold text-lg hover:translate-x-2 transition-transform duration-300"
              >
                {pillar.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
