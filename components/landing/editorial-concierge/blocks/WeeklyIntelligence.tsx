'use client';
import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { ArrowRight, AlertCircle, Info, ShieldCheck, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function WeeklyIntelligence() {
  return (
    <SectionWrapper>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <div>
            <ConciergeLabel className="text-emerald-600 mb-4 block">Safety Briefing</ConciergeLabel>
            <EditorialHeading size="xl">Barcelona Intelligence</EditorialHeading>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-50 border border-emerald-100">
            <Newspaper className="w-4 h-4 text-emerald-600" />
            <ConciergeLabel size="xs" emphasis="high" className="text-emerald-700">Updated: Feb 24, 2026</ConciergeLabel>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Legal Framework', 
              content: "Catalonia's regulatory landscape requires member discretion. Private associations operate under strict privacy rules that you should understand before visiting.", 
              icon: ShieldCheck, 
              color: 'text-blue-500',
              bg: 'bg-blue-50'
            },
            { 
              title: 'Safety Protocol', 
              content: 'Stay safe by avoiding street promoters and fake storefronts. Legitimate associations never recruit in public spaces or near tourist landmarks.', 
              icon: AlertCircle, 
              color: 'text-red-500',
              bg: 'bg-red-50'
            },
            { 
              title: 'Harm Reduction', 
              content: 'Responsible consumption starts with respecting the neighborhood. Keep noise levels low after 10 PM to honor local residential agreements.', 
              icon: Info, 
              color: 'text-amber-500',
              bg: 'bg-amber-50'
            },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="group relative p-8 rounded-[2rem] bg-white border border-zinc-200/50 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden cursor-pointer"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 group-hover:opacity-100 transition-all duration-500 -z-10" />

              <div className="relative z-10">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <h4 className="text-xl font-bold text-zinc-900 mb-4 transition-colors duration-500 group-hover:text-emerald-600">{item.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed transition-colors duration-500 group-hover:text-zinc-700">
                  {item.content}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100 relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-emerald-600 transition-colors duration-500">
                Read Context
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-600 group-hover:translate-x-1 transition-all duration-500" />
              </div>

              {/* Expanding Accent Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-1/3 transition-all duration-500 z-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}


