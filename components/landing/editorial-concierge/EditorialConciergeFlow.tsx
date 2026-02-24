import React from 'react';
import { TrustStrip } from './blocks/TrustStrip';
import { KnowledgeRouter } from './blocks/KnowledgeRouter';
import { RealityCheck } from './blocks/RealityCheck';
import { BeginnersOnramp } from './blocks/BeginnersOnramp';
import { ConciergeTools } from './blocks/ConciergeTools';
import { FeaturedVault } from './blocks/FeaturedVault';
import { NewsletterDrop } from './blocks/NewsletterDrop';
import { WeeklyIntelligence } from './blocks/WeeklyIntelligence';
import { VerificationStandard } from './blocks/VerificationStandard';
import { CommunityRoadmap } from './blocks/CommunityRoadmap';
import { EditorialFAQ } from './blocks/EditorialFAQ';
import { FinalMicDrop } from './blocks/FinalMicDrop';
import { type ArticleCard } from '@/app/actions/articles';

export interface EditorialConciergeFlowProps {
  featuredArticles: ArticleCard[];
}

/**
 * Editorial Concierge Landing Page
 * 
 * Main entry point for the "God-Level" rebranding.
 * Follows a premium editorial aesthetic.
 */
export default function EditorialConciergeFlow({ featuredArticles }: EditorialConciergeFlowProps) {
  return (
    <div className="relative font-sans antialiased text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Trust Anchor (Fixed on scroll) */}
      <TrustStrip />
      {/* 2. Knowledge Router (Bento Grid) */}
      <KnowledgeRouter />
      {/* 3. Reality Check (Dark Section) */}
      <RealityCheck />
      {/* 4. Beginners Onramp (Split Screen) */}
      <BeginnersOnramp />
      {/* 5. Weekly Intelligence (Dynamic Feed) */}
      <WeeklyIntelligence />
      
      {/* 6. Concierge Tools (Interactive) */}
      <ConciergeTools />
      
      {/* 7. The Vault (Real Article Data) */}
      <FeaturedVault articles={featuredArticles} />
      
      {/* 8. Newsletter Drop (Conversion) */}
      <NewsletterDrop />
      {/* 9. Our Standard (Forensic Trust) */}
      <VerificationStandard />
      
      {/* 10. Barcelona Roadmap (Vertical Timeline) */}
      <CommunityRoadmap />
      
      {/* 11. FAQ (Minimalist) */}
      <EditorialFAQ />
      
      {/* 12. Final Mic Drop (100vh CTA) */}
      <FinalMicDrop />
    </div>
  );
}
