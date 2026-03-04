'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { TrustStrip } from './blocks/TrustStrip';
import { RealityCheck } from './blocks/RealityCheck';
import { WhoWeAre } from './blocks/WhoWeAre';
import { FeaturedVault } from './blocks/FeaturedVault';
import { ConciergeTools } from './blocks/ConciergeTools';
import { VerificationStandard } from './blocks/VerificationStandard';
import { NewsletterDrop } from './blocks/NewsletterDrop';
import { CommunityRoadmap } from './blocks/CommunityRoadmap';
import { KnowledgeRouter } from './blocks/KnowledgeRouter';
import { BeginnersOnramp } from './blocks/BeginnersOnramp';
import { EditorialFAQ } from './blocks/EditorialFAQ';
import { FinalMicDrop } from './blocks/FinalMicDrop';
import { clearAnalyticsContext, setAnalyticsContext, trackEvent } from '@/lib/analytics';
import { resolveExperimentArm } from '@/lib/experiments';

const SECTION_KEYS = [
  'trust_strip',
  'reality_check',
  'who_we_are',
  'featured_vault',
  'concierge_tools',
  'verification_standard',
  'newsletter_drop',
  'community_roadmap',
  'knowledge_router',
  'beginners_onramp',
  'editorial_faq',
  'final_mic_drop',
] as const;

const LANDING_EXPERIMENT_CONTEXT = {
  variant_id: 'editorial_concierge_v1',
  section_version: '2026-02-24',
  copy_version: 'trust_first_v2',
} as const;

const ONRAMP_EXPERIMENT_ID = 'landing_onramp_copy_v1';
const ONRAMP_EXPERIMENT_ARMS = ['control', 'benefit'] as const;

export default function EditorialConciergeFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [onrampAssignment, setOnrampAssignment] = useState<{ arm: string; source: 'query' | 'storage' | 'random' }>({
    arm: ONRAMP_EXPERIMENT_ARMS[0],
    source: 'random',
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setOnrampAssignment(
        resolveExperimentArm({
          experimentId: ONRAMP_EXPERIMENT_ID,
          allowedArms: ONRAMP_EXPERIMENT_ARMS,
          searchParams: new URLSearchParams(window.location.search),
        })
      );
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

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
    let scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let frameId: number | null = null;

    const updateDepth = () => {
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

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateDepth();
      });
    };

    const onResize = () => {
      scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    updateDepth();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative font-sans antialiased bg-bg-base text-zinc-900 selection:bg-brand selection:text-black">
      {/* Section 2: Trust Strip (The Marquee) */}
      <section data-landing-section={SECTION_KEYS[0]}><TrustStrip /></section>
      
      {/* Section 3: Reality Check (Three Mistakes) */}
      <section data-landing-section={SECTION_KEYS[1]}><RealityCheck /></section>
      
      {/* Section 4: Who We Are (The Three Pillars) */}
      <section data-landing-section={SECTION_KEYS[2]}><WhoWeAre /></section>
      
      {/* Section 5: Content Showcase (Featured Vault) */}
      <section data-landing-section={SECTION_KEYS[3]}><FeaturedVault /></section>
      
      {/* Section 6: Interactive Tool (Concierge Tools / Quiz) */}
      <section data-landing-section={SECTION_KEYS[4]}><ConciergeTools /></section>
      
      {/* Section 7: Directory Teaser (Verification Standard) */}
      <section data-landing-section={SECTION_KEYS[5]}><VerificationStandard /></section>
      
      {/* Section 8: Newsletter Drop (The Climax) */}
      <section data-landing-section={SECTION_KEYS[6]}><NewsletterDrop /></section>
      
      {/* Section 9: City Previews (Community Roadmap Repurposed) */}
      <section data-landing-section={SECTION_KEYS[7]}><CommunityRoadmap /></section>
      
      {/* Section 10: Events Bar (Knowledge Router Repurposed) */}
      <section data-landing-section={SECTION_KEYS[8]}><KnowledgeRouter /></section>
      
      {/* Section 11: The Manifesto (Beginners Onramp Repurposed) */}
      <section data-landing-section={SECTION_KEYS[9]}><BeginnersOnramp /></section>
      
      {/* Section 12: Editorial FAQ */}
      <section data-landing-section={SECTION_KEYS[10]}><EditorialFAQ /></section>
      
      {/* Section 13: Final Mic Drop */}
      <section data-landing-section={SECTION_KEYS[11]}><FinalMicDrop /></section>
    </div>
  );
}
