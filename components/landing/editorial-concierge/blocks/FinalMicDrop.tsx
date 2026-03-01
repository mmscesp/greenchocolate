'use client';

import React, { useState } from 'react';
import { ArrowRight } from '@/lib/icons';

export function FinalMicDrop() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-black min-h-[100dvh] flex items-center justify-center text-center py-20 px-4 relative overflow-hidden">
      {/* Pure black background, minimalist approach */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />

      <div className="relative z-20 max-w-3xl w-full mx-auto">
        <h2 className="text-[12vw] md:text-[7rem] font-black font-serif text-white tracking-tighter leading-none mb-6">
          Know<br />Before<br />You Go.
        </h2>
        
        <p className="text-xl md:text-2xl text-zinc-400 font-medium mb-16">
          The Safety Kit. The guides. The verified clubs. It all starts here.
        </p>

        <div className="max-w-md mx-auto w-full">
          {submitted ? (
            <div className="text-emerald-400 font-bold text-xl py-6">
              Sent. Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl text-xl text-center text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E8A838] transition-all"
              />
              <button
                type="submit"
                className="w-full px-8 py-5 bg-[#E8A838] hover:bg-[#d4962e] text-black font-black text-xl rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Get the Safety Kit &rarr;
              </button>
            </form>
          )}
        </div>

        <p className="mt-12 text-zinc-600 text-xs font-bold uppercase tracking-widest">
          Free forever. One email per week. Unsubscribe in one click. No spam. No sponsors.
        </p>
      </div>
    </section>
  );
}
