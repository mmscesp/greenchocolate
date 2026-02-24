import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { AlertCircle, Info, Calendar, Newspaper } from 'lucide-react';

export function WeeklyIntelligence() {
  return (
    <SectionWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <div>
            <ConciergeLabel className="text-emerald-600 mb-4 block">Habitual Insight</ConciergeLabel>
            <EditorialHeading size="xl">This Week in Barcelona</EditorialHeading>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-50 border border-emerald-100">
            <Newspaper className="w-4 h-4 text-emerald-600" />
            <ConciergeLabel size="xs" emphasis="high" className="text-emerald-700">Updated: Feb 24, 2026</ConciergeLabel>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Legal Update', 
              content: 'Recent inspections in Eixample emphasize the importance of member discretion. No changes to Law 4/2015 reported.', 
              icon: Info, 
              color: 'text-blue-500',
              bg: 'bg-blue-50'
            },
            { 
              title: 'Scam Alert', 
              content: 'New wave of fake "Zaza" storefronts reported near Las Ramblas. Always verify through official registry channels.', 
              icon: AlertCircle, 
              color: 'text-red-500',
              bg: 'bg-red-50'
            },
            { 
              title: 'Culture Note', 
              content: 'The "Respeto" movement grows. Residential clubs are tightening noise protocols after 10 PM. Respect neighbor silence.', 
              icon: Calendar, 
              color: 'text-amber-500',
              bg: 'bg-amber-50'
            },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-zinc-100 bg-white hover:shadow-xl hover:shadow-zinc-100 transition-all group">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", item.bg)}>
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-4">{item.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {item.content}
              </p>
              <div className="mt-8 pt-8 border-t border-zinc-50">
                <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-600 transition-colors">
                  Read Context
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
