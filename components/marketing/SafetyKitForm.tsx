'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function SafetyKitForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="relative p-8 rounded-3xl border border-green-500/30 bg-green-500/10 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-3xl" />
        <div className="relative">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
          <p className="text-zinc-400 mb-0">Check your email for the Visitor Safety Kit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/0 via-green-500/10 to-emerald-500/0 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Get the Visitor Safety Kit</h3>
          <p className="text-zinc-400">Avoid €600+ fines and navigate Spain&apos;s culture like a local friend.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-zinc-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all outline-none text-white placeholder:text-zinc-500"
            />
          </div>
          <button
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
          >
            {status === 'loading' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Download Free Kit <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
          <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
            Privacy first. No spam. Ever.
          </p>
        </form>
      </div>
    </div>
  );
}
