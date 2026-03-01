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
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export function RealityCheck() {
  const { language } = useLanguage();

  const cards = [
    {
      title: "THE WALK-IN",
      myth: "\"I'll just show up and walk in.\"",
      reality: "Cannabis Social Clubs are private associations. There is no tourist entrance. No guest policy. No exceptions. You cannot walk in off the street — period. Visitors who try get turned away at the door, or worse, get approached by unlicensed street dealers who position themselves outside clubs specifically to intercept confused tourists. That's not a hypothetical. It happens every day, in every major Spanish city."
    },
    {
      title: "THE STREET FIXER",
      myth: "\"The guy outside said he could get me in.\"",
      reality: "Street promoters near popular clubs are not affiliated with those clubs. They're unlicensed middlemen — sometimes individuals, sometimes organized — who charge inflated fees for introductions that may not work, products that aren't verified, or access to unlicensed operations that aren't real clubs at all. This is the number one way tourists lose money, receive unsafe products, or end up in situations that carry genuine legal risk. If someone approaches you unsolicited, walk away."
    },
    {
      title: "THE LEGAL ASSUMPTION",
      myth: "\"Cannabis is basically legal here, right?\"",
      reality: "Not even close. Cannabis Social Clubs operate in a legal grey zone — no national law explicitly legalizes them, and Spain's Supreme Court has repeatedly narrowed what courts consider non-criminal. Catalonia tried to regulate clubs in 2017; that law was struck down as unconstitutional. What IS black and white: public possession or consumption is an administrative offense carrying fines from €601 to €30,000. Private and public are two completely different legal universes in Spain. If you don't know the line, you're gambling."
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
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
