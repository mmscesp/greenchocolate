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
      <div className="bg-rose-50 p-8 rounded-2xl text-center border border-rose-100 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">You're on the list!</h3>
        <p className="text-zinc-600 mb-0">Check your email for the Visitor Safety Kit.</p>
      </div>
    );
  }

  return (
    <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Get the Visitor Safety Kit</h3>
        <p className="text-zinc-600">Avoid €600+ fines and navigate Spain's culture like a local friend.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-zinc-900"
          />
        </div>
        <button
          disabled={status === 'loading'}
          className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {status === 'loading' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Download Free Kit <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest font-bold">
          Privacy first. No spam. Ever.
        </p>
      </form>
    </div>
  );
}
