import React from 'react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { EditorialHeading } from '../typography/EditorialHeading';
import { ConciergeLabel } from '../typography/ConciergeLabel';
import { ArrowRight, Clock, User } from 'lucide-react';
import { type ArticleCard } from '@/app/actions/articles';

interface FeaturedVaultProps {
  articles: ArticleCard[];
}

export function FeaturedVault({ articles }: FeaturedVaultProps) {
  return (
    <SectionWrapper>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <ConciergeLabel className="mb-4 text-emerald-600">The Vault</ConciergeLabel>
          <EditorialHeading size="xl">Expert Guides & Insights</EditorialHeading>
        </div>
        <button className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-zinc-500 hover:text-emerald-600 transition-colors">
          Browse All Guides <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group cursor-pointer">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-zinc-200">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-zinc-300 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-zinc-900">
                  Legal Reality
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <ConciergeLabel size="xs" emphasis="low">8 min read</ConciergeLabel>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <ConciergeLabel size="xs" emphasis="low">Editorial Team</ConciergeLabel>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors leading-tight">
                Understanding the 2026 Spanish Legal Framework for CSCs
              </h3>
              <p className="text-zinc-500 line-clamp-2">
                A forensic deep dive into public vs private consumption, administrative fines, and your rights as a member.
              </p>
              
              <div className="pt-2 flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                Read Guide <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
