'use client';

import { useState } from 'react';
import { Rocket, Loader2, PartyPopper } from '@/lib/icons';

export default function WaitlistForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
        <PartyPopper className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-1">You're #1,432!</h3>
        <p className="text-green-700">Check your inbox to move up the list.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <input
            id="waitlist-email"
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
        </div>
        <button
          disabled={status === 'loading'}
          className="bg-green-500 hover:bg-green-400 text-zinc-900 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {status === 'loading' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Get Access <Rocket className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-white/60 uppercase tracking-widest">
        <span>Verified Only</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>Limited Slots</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>Secure Access</span>
      </div>
    </div>
  );
}
