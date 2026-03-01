'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
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

export function RealityCheck() {
  const { language } = useLanguage();

  const cards = [
    {
      title: "THE WALK-IN",
      myth: "\"I'll just show up and walk in.\"",
      reality: "No tourist entrance. No guest policy. No walk-ins. Private members-only — full stop. Try it and you'll meet the unlicensed street dealers who wait outside for exactly this moment."
    },
    {
      title: "THE STREET FIXER",
      myth: "\"The guy outside said he could get me in.\"",
      reality: "Street promoters aren't affiliated with the clubs they stand near. Inflated fees. Fake introductions. Unverified products. The number one way tourists get burned. Approached unsolicited? Walk away."
    },
    {
      title: "THE LEGAL ASSUMPTION",
      myth: "\"Cannabis is basically legal here, right?\"",
      reality: "Not even close. No national law explicitly legalizes them. Public possession or consumption? Fines from €601 to €30,000. Private and public are two different legal universes. Don't know the line? You're gambling."
    }
  ];

  return (
    <section className="bg-[#0a0a0a] pt-24 pb-32 px-4 md:px-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight mb-4 leading-tight">
            Three Mistakes Tourists Make Every Single Day in Spain
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-medium">
            Each one is avoidable. None of them are obvious.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col shadow-xl"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
                {card.title}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#E8A838] mb-6 leading-snug">
                {card.myth}
              </h3>
              <p className="text-base text-white/80 leading-relaxed font-medium">
                {card.reality}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href={`/${language}/editorial/legal`}
            className="inline-flex items-center text-[#E8A838] hover:text-[#d4962e] font-bold text-lg transition-colors group"
          >
            Read the full legal landscape
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
