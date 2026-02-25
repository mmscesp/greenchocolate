import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { StickyAccordion } from '../interactive/StickyAccordion';
import { AlertTriangle, ShieldCheck, MapPin } from '@/lib/icons';

const REALITY_ITEMS = [
  { 
    title: 'No Walk-ins', 
    desc: 'Private associations require compliance with strict statutes and local ordinances. Expect rejection if you arrive without preparation.', 
    iconName: 'ShieldCheck',
    color: 'from-emerald-500 to-teal-600'
  },
  { 
    title: 'Public Consumption', 
    desc: 'Administrative fines range from €601 to €30,000. Privacy is your only protection from local authorities.', 
    iconName: 'AlertTriangle',
    color: 'from-red-500 to-rose-600'
  },
  { 
    title: 'Discretion First', 
    desc: 'No filming, no social media tagging, no neighbor noise. We are guests in these residential neighborhoods.', 
    iconName: 'MapPin',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    title: 'Avoid Promoters', 
    desc: 'Street promoters and DM solicitations operate outside the legal framework and expose you to unnecessary risk.', 
    iconName: 'ShieldCheck',
    color: 'from-amber-500 to-orange-600'
  },
];

export function RealityCheck() {
  return (
    <SectionWrapper glass className="pt-32 pb-48">
      <div className="max-w-3xl mb-24">
        <ConciergeLabel className="text-red-500 mb-6">Reality Check</ConciergeLabel>
        <EditorialHeading size="2xl" className="text-white">Spain is <span className="italic text-red-500">not</span> Amsterdam.</EditorialHeading>
      </div>

      <StickyAccordion items={REALITY_ITEMS} />
    </SectionWrapper>
  );
}
