import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { CheckCircle2, ShieldCheck, Fingerprint, Lock } from 'lucide-react';

export function VerificationStandard() {
  return (
    <SectionWrapper>
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
        <div>
          <ConciergeLabel className="text-emerald-600 mb-6">Our Standard</ConciergeLabel>
          <EditorialHeading size="xl" className="mb-8">The Verification Moat</EditorialHeading>
          <p className="text-lg text-zinc-500 leading-relaxed mb-12">
            We don't just list clubs. Every partner undergoes a multi-point verification process 
            to ensure they operate within the strict legal framework of Spanish private associations.
          </p>
          
          <div className="space-y-8">
            {[
              { title: 'Legal Compliance Audit', desc: 'Verified non-profit status and registration.', icon: ShieldCheck },
              { title: 'Privacy Protection', desc: 'GDPR-compliant handling of member data.', icon: Lock },
              { title: 'Transparency Policy', desc: 'Clear communication of rules and statutes.', icon: Fingerprint },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', 
              backgroundSize: '32px 32px' 
            }} />
          </div>
          
          <div className="relative z-10">
            <ConciergeLabel emphasis="high" className="mb-12 block">Forensic Integrity</ConciergeLabel>
            
            <div className="space-y-8">
              <div className="pb-8 border-b border-white/10">
                <h4 className="font-serif text-xl mb-4 text-emerald-400 font-bold">What We Verify</h4>
                <ul className="space-y-3">
                  {['Association Registry Status', 'Statutes & House Rules', 'Physical Premises Security', 'Safe Member Onboarding'].map(s => (
                    <li key={s} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif text-xl mb-4 text-zinc-400 font-bold">What We Cannot Guarantee</h4>
                <ul className="space-y-3 opacity-60">
                  {['Third-party conduct', 'Future legal changes', 'Inventory availability'].map(s => (
                    <li key={s} className="flex items-center gap-3 text-sm text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
