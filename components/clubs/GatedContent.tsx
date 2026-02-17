import React from 'react';
import { Lock, ShieldAlert, Fingerprint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  blurLevel?: 'medium' | 'heavy';
  label?: string;
  description?: string;
}

export default function GatedContent({ 
  blurLevel = 'heavy', 
  label = 'Restricted Access',
  description = 'Sensitive club details are only visible to verified members.'
}: Props) {
  const blurClass = blurLevel === 'heavy' ? 'blur-xl' : 'blur-lg';
  
  return (
    <div className="relative overflow-hidden rounded-2xl group border border-white/5">
      {/* Blurred Background Content */}
      <div className={`${blurClass} select-none pointer-events-none opacity-20 bg-midnight-charcoal p-8`}>
        <div className="space-y-4">
           <div className="h-6 w-3/4 bg-white/10 rounded-lg"></div>
           <div className="h-4 w-1/2 bg-white/10 rounded-lg"></div>
           <div className="h-4 w-full bg-white/10 rounded-lg"></div>
           <div className="h-4 w-5/6 bg-white/10 rounded-lg"></div>
           <div className="h-10 w-full bg-white/10 rounded-xl mt-6"></div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-midnight-charcoal/40 backdrop-blur-[2px] z-10 p-6 text-center">
         <div className="bg-midnight-charcoal/90 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                <Fingerprint className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="font-serif text-2xl text-white mb-3">{label}</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                {description}
              </p>
              
              <div className="grid gap-4">
                <Button className="w-full py-6 bg-primary text-primary-foreground font-bold rounded-xl uppercase tracking-widest text-xs group/btn" asChild>
                  <Link href="/register">
                    <span>Initiate Verification</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-2">
                  <Link href="/login" className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">
                    Member Login
                  </Link>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <Link href="/faq" className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">
                    Legal FAQ
                  </Link>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
