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
      <div className="relative p-10 rounded-3xl border border-primary/30 bg-midnight-charcoal/80 backdrop-blur-md animate-in fade-in zoom-in duration-500 text-center">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-3xl font-serif text-white mb-3">Transmission Successful</h3>
          <p className="text-muted-foreground mb-0">Your Visitor Safety Kit is being securely delivered to your inbox.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-10 rounded-3xl border border-white/5 bg-midnight-charcoal/50 backdrop-blur-md overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">2026 Safety Protocol</span>
          </div>
          <h3 className="text-3xl font-serif text-white mb-3">The Visitor Safety Kit</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Avoid €600+ fines and navigate Barcelona&apos;s legal grey market with forensic precision.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Enter your secure email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all outline-none text-white placeholder:text-zinc-600 font-sans"
            />
          </div>
          <button
            disabled={status === 'loading'}
            className="w-full bg-primary text-primary-foreground py-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-primary/10 uppercase tracking-widest text-xs"
          >
            {status === 'loading' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Initiate Download <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold mt-4">
            AES-256 Encrypted • Privacy Guaranteed
          </p>
        </form>
      </div>
    </div>
  );
}
