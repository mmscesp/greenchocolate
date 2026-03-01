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
            Cannabis Clubs in Spain Can&apos;t Tell Their Own Story.<br />
            <span className="text-zinc-500">Someone Had To.</span>
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
            <p>
              Here&apos;s the reality. Cannabis Social Clubs in Spain cannot advertise. Cannot promote themselves. Cannot have a public-facing presence of any kind. The ones operating correctly — the ones you&apos;d actually want to visit — do this because they respect the legal framework that allows them to exist, and they protect their members by staying invisible. But that silence creates a vacuum. And vacuums get filled.
            </p>
            
            <p>
              Into that vacuum rush the scammers. The street fixers working outside clubs they have no affiliation with. The fake &quot;associations&quot; running out of apartments. The Telegram channels selling access to places that don&apos;t exist. The review sites that list places which should never be listed publicly. And every year, millions of travelers arrive in Spain — curious, well-intentioned, completely unarmed — with no reliable way to tell the difference between what&apos;s real and what&apos;s a trap.
            </p>

            <p>
              We built SocialClubsMaps because the information gap was causing real, measurable harm — to tourists who got scammed, to clubs whose reputations suffered by association, and to a culture that deserves to be understood on its own terms, not through the lens of whoever bought the top Google result.
            </p>

            <p className="text-2xl md:text-3xl text-white font-bold leading-snug pt-6 border-t border-white/10 mt-12">
              We are not here to sell access. We are here to make sure the people who want to navigate this world can do it safely, respectfully, and with their eyes fully open.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
