'use client';

import React from 'react';
import { useEffect, useRef } from 'react';
import { TrustStrip } from './blocks/TrustStrip';
import { RealityCheck } from './blocks/RealityCheck';
import { ConciergeTools } from './blocks/ConciergeTools';
import { VerificationStandard } from './blocks/VerificationStandard';
import { FeaturedVault } from './blocks/FeaturedVault';
import { EditorialFAQ } from './blocks/EditorialFAQ';
import { FinalMicDrop } from './blocks/FinalMicDrop';
import { clearAnalyticsContext, setAnalyticsContext, trackEvent } from '@/lib/analytics';

const SECTION_KEYS = [
  'trust_strip',
  'reality_check',
  'concierge_tools',
  'verification_standard',
  'featured_vault',
  'editorial_faq',
  'final_mic_drop',
] as const;

const LANDING_EXPERIMENT_CONTEXT = {
  variant_id: 'editorial_concierge_v2',
  section_version: '2026-04-09',
  copy_version: 'clarity_first_v1',
} as const;
const DEFERRED_SECTION_START_INDEX = 2;

const INTRINSIC_SECTION_STYLE: React.CSSProperties = {
  contentVisibility: 'auto',
  containIntrinsicSize: '1200px',
};

function scheduleIdleTask(callback: () => void, timeout: number) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }

  const timeoutId = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(timeoutId);
}

export default function EditorialConciergeFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnalyticsContext(LANDING_EXPERIMENT_CONTEXT);

    return () => {
      clearAnalyticsContext(['variant_id', 'section_version', 'copy_version']);
    };
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const seen = new Set<string>();
    let observer: IntersectionObserver | null = null;

    const cancelIdleTask = scheduleIdleTask(() => {
      observer = new IntersectionObserver(
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
      nodes.forEach((node) => observer?.observe(node));
    }, 1200);

    return () => {
      cancelIdleTask();
      observer?.disconnect();
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

    const cancelIdleTask = scheduleIdleTask(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      updateDepth();
    }, 1400);

    return () => {
      cancelIdleTask();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative font-sans antialiased bg-bg-base text-zinc-900 selection:bg-brand selection:text-black">
      {[
        <TrustStrip key={SECTION_KEYS[0]} />,
        <RealityCheck key={SECTION_KEYS[1]} />,
        <ConciergeTools key={SECTION_KEYS[2]} />,
        <VerificationStandard key={SECTION_KEYS[3]} />,
        <FeaturedVault key={SECTION_KEYS[4]} />,
        <EditorialFAQ key={SECTION_KEYS[5]} />,
        <FinalMicDrop key={SECTION_KEYS[6]} />,
      ].map((component, index) => (
        <section
          key={SECTION_KEYS[index]}
          data-landing-section={SECTION_KEYS[index]}
          style={index >= DEFERRED_SECTION_START_INDEX ? INTRINSIC_SECTION_STYLE : undefined}
        >
          {component}
        </section>
      ))}
    </div>
  );
}
