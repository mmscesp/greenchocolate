import { describe, expect, it } from 'vitest';
import { resolveConciergePlan, resolveReadinessTier, type QuizAnswers } from './concierge-tools-plan';

function buildAnswers(overrides: Partial<QuizAnswers>): QuizAnswers {
  return {
    timeline: 'within_month',
    experience: 'beginner',
    city: 'barcelona',
    ...overrides,
  };
}

describe('resolveReadinessTier', () => {
  it('keeps uncertain and early-stage users in orientation', () => {
    const answers = buildAnswers({ city: 'not_sure', experience: 'beginner', timeline: 'few_months' });
    expect(resolveReadinessTier(answers, false)).toBe('orientation');
  });

  it('marks experienced Barcelona users as ready', () => {
    const answers = buildAnswers({ experience: 'been_before', city: 'barcelona', timeline: 'this_weekend' });
    expect(resolveReadinessTier(answers, true)).toBe('ready');
  });
});

describe('resolveConciergePlan', () => {
  it('routes undecided users into the email-first city decider plan', () => {
    const plan = resolveConciergePlan({
      answers: buildAnswers({ city: 'not_sure', experience: 'coffeeshops' }),
      language: 'en',
    });

    expect(plan.variant).toBe('city_decider');
    expect(plan.primaryCta.kind).toBe('email_plan');
    expect(plan.secondaryCta.kind).toBe('safety');
    expect(plan.steps[2]?.href).toBe('/en/spain/barcelona');
    expect(plan.steps[0]).toMatchObject({
      previewTitleKey: 'landing.concierge_tools.steps.foundation.title',
      previewBodyKey: 'landing.concierge_tools.steps.foundation.body',
      ctaLabelKey: 'landing.concierge_tools.steps.foundation.cta',
      promotedCtaLabelKey: 'landing.concierge_tools.steps.foundation.promoted_cta',
    });
  });

  it('routes experienced Barcelona users into the fast-track plan', () => {
    const plan = resolveConciergePlan({
      answers: buildAnswers({ city: 'barcelona', experience: 'member_somewhere', timeline: 'already_here' }),
      language: 'en',
    });

    expect(plan.variant).toBe('fast_track');
    expect(plan.readiness).toBe('ready');
    expect(plan.primaryCta.href).toBe('/en/spain/barcelona/clubs');
    expect(plan.steps[2]?.kind).toBe('live_city');
    expect(plan.steps[2]).toMatchObject({
      previewTitleKey: 'landing.concierge_tools.steps.live_city.title',
      previewBodyKey: 'landing.concierge_tools.steps.live_city.body',
      ctaLabelKey: 'landing.concierge_tools.steps.live_city.cta',
      promotedCtaLabelKey: 'landing.concierge_tools.steps.live_city.promoted_cta',
    });
  });

  it('routes non-live cities to the city scout plan and safe city page', () => {
    const plan = resolveConciergePlan({
      answers: buildAnswers({ city: 'madrid', experience: 'been_before', timeline: 'within_month' }),
      language: 'en',
    });

    expect(plan.variant).toBe('city_scout');
    expect(plan.cityIsLive).toBe(false);
    expect(plan.primaryCta.kind).toBe('city_watch');
    expect(plan.primaryCta.href).toBe('/en/spain/madrid');
    expect(plan.steps[2]).toMatchObject({
      kind: 'city_watch',
      previewTitleKey: 'landing.concierge_tools.steps.city_watch.title',
      previewBodyKey: 'landing.concierge_tools.steps.city_watch.body',
      ctaLabelKey: 'landing.concierge_tools.steps.city_watch.cta',
      promotedCtaLabelKey: 'landing.concierge_tools.steps.city_watch.promoted_cta',
    });
  });
});
