'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BeginnersOnramp() {
  return (
    <section className="bg-[#0a0a0a] py-32 md:py-48 px-4 md:px-8 border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight mb-12 leading-tight">
            Tourists Deserve Better Than Guesswork. So We Built Something Real.
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
            <p>
              Finding reliable information about Cannabis Social Clubs in Spain is nearly impossible. No central resource. No official directory. Into that vacuum rush the scammers — street fixers, fake associations, Telegram channels selling access to places that don&apos;t exist. Millions of travelers arrive every year with no way to tell what&apos;s real from what&apos;s a trap.
            </p>

            <p>
              We built SocialClubsMaps because the information gap was causing real harm — to travelers, to the culture, and to a scene that deserves better.
            </p>

            <p className="text-2xl md:text-3xl text-white font-bold leading-snug pt-6 border-t border-white/10 mt-12">
              We are not here to sell access. We are here to make sure anyone who wants to navigate this world can do it safely, respectfully, and with their eyes open.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
