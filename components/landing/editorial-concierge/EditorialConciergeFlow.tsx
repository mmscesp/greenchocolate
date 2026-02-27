'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { TrustStrip } from './blocks/TrustStrip';
import { WhoWeAre } from './blocks/WhoWeAre';
import { KnowledgeRouter } from './blocks/KnowledgeRouter';
import { RealityCheck } from './blocks/RealityCheck';
import { BeginnersOnramp } from './blocks/BeginnersOnramp';
import { ConciergeTools } from './blocks/ConciergeTools';
import { NewsletterDrop } from './blocks/NewsletterDrop';

import { VerificationStandard } from './blocks/VerificationStandard';
import { CommunityRoadmap } from './blocks/CommunityRoadmap';
import { EditorialFAQ } from './blocks/EditorialFAQ';
import { FinalMicDrop } from './blocks/FinalMicDrop';
import { clearAnalyticsContext, setAnalyticsContext, trackEvent } from '@/lib/analytics';
import { resolveExperimentArm } from '@/lib/experiments';

const SECTION_KEYS = [
  'trust_strip',
  'who_we_are',
  'beginners_onramp',
  'knowledge_router',
  'reality_check',
  'verification_standard',
  'concierge_tools',
  'newsletter_drop',
  'editorial_faq',
  'community_roadmap',
  'final_mic_drop',
] as const;

const LANDING_EXPERIMENT_CONTEXT = {
  variant_id: 'editorial_concierge_v1',
  section_version: '2026-02-24',
  copy_version: 'trust_first_v2',
} as const;

const ONRAMP_EXPERIMENT_ID = 'landing_onramp_copy_v1';
const ONRAMP_EXPERIMENT_ARMS = ['control', 'benefit'] as const;

/**
 * Editorial Concierge Landing Page
 * 
 * Main entry point for the "God-Level" rebranding.
 * Follows a premium editorial aesthetic.
 */
export default function EditorialConciergeFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [onrampAssignment] = useState<{ arm: string; source: 'query' | 'storage' | 'random' }>(
    () => {
      if (typeof window === 'undefined') {
        return {
          arm: ONRAMP_EXPERIMENT_ARMS[0],
          source: 'random' as const,
        };
      }

      return resolveExperimentArm({
        experimentId: ONRAMP_EXPERIMENT_ID,
        allowedArms: ONRAMP_EXPERIMENT_ARMS,
        searchParams: new URLSearchParams(window.location.search),
      });
    }
  );

  useEffect(() => {
    setAnalyticsContext({
      ...LANDING_EXPERIMENT_CONTEXT,
      experiment_id: ONRAMP_EXPERIMENT_ID,
      arm_id: onrampAssignment.arm,
      arm_source: onrampAssignment.source,
    });

    trackEvent('experiment_exposure', {
      experiment_id: ONRAMP_EXPERIMENT_ID,
      arm_id: onrampAssignment.arm,
      arm_source: onrampAssignment.source,
    });

    return () => {
      clearAnalyticsContext([
        'variant_id',
        'section_version',
        'copy_version',
        'experiment_id',
        'arm_id',
        'arm_source',
      ]);
    };
  }, [onrampAssignment.arm, onrampAssignment.source]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target.getAttribute('data-landing-section');
          if (!section || seen.has(section)) continue;
          seen.add(section);
          trackEvent('landing_section_view', {
            section,
            visibility_ratio: Number(entry.intersectionRatio.toFixed(2)),
          });
        }
      },
      {
        threshold: [0.2, 0.5],
      }
    );

    const nodes = root.querySelectorAll<HTMLElement>('[data-landing-section]');
    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const fired = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);

      for (const milestone of milestones) {
        if (percent >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          trackEvent('landing_scroll_depth', {
            depth_percent: milestone,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative font-sans antialiased text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Trust Anchor (Fixed on scroll) */}
      <section data-landing-section={SECTION_KEYS[0]}><TrustStrip /></section>
      {/* 2. Who We Are (Identity + trust) */}
      <section data-landing-section={SECTION_KEYS[1]}><WhoWeAre /></section>
      {/* 3. Beginners Onramp (Welcome first!) */}
      <section data-landing-section={SECTION_KEYS[2]}><BeginnersOnramp experimentArm={onrampAssignment.arm as 'control' | 'benefit'} /></section>
      {/* 4. Knowledge Router (Bento Grid) */}
      <section data-landing-section={SECTION_KEYS[3]}><KnowledgeRouter /></section>
      {/* 5. Reality Check (Warnings after trust context) */}
      <section data-landing-section={SECTION_KEYS[4]}><RealityCheck /></section>
      {/* 6. Verification Standard (Reassure after warnings) */}
      <section data-landing-section={SECTION_KEYS[5]}><VerificationStandard /></section>
      {/* 7. Concierge Tools (Interactive) */}
      <section data-landing-section={SECTION_KEYS[6]}><ConciergeTools /></section>
      {/* 8. Newsletter Drop (Conversion) */}
      <section data-landing-section={SECTION_KEYS[7]}><NewsletterDrop /></section>
      {/* 9. FAQ (Before commitment) */}
      <section data-landing-section={SECTION_KEYS[8]}><EditorialFAQ /></section>
      {/* 10. Barcelona Roadmap (Vertical Timeline) */}
      <section data-landing-section={SECTION_KEYS[9]}><CommunityRoadmap /></section>
      {/* 11. Final Mic Drop (100vh CTA) */}
      <section data-landing-section={SECTION_KEYS[10]}><FinalMicDrop /></section>
    </div>
  );
}
