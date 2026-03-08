export const LIVE_CITY_SLUG = 'barcelona';

export type TimelineOptionId = 'this_weekend' | 'within_month' | 'few_months' | 'already_here';
export type ExperienceOptionId = 'beginner' | 'coffeeshops' | 'been_before' | 'member_somewhere';
export type CityOptionId = 'barcelona' | 'madrid' | 'valencia' | 'tenerife' | 'not_sure';
export type QuestionId = 'timeline' | 'experience' | 'city';
export type ReadinessTier = 'orientation' | 'planning' | 'ready';
export type PlanVariant = 'city_decider' | 'first_trip' | 'fast_track' | 'city_scout';
export type StepKind =
  | 'foundation'
  | 'culture_reset'
  | 'safety'
  | 'legal'
  | 'scams'
  | 'first_visit'
  | 'live_city'
  | 'city_watch'
  | 'live_now';
export type CtaKind = 'email_plan' | 'live_city' | 'city_watch' | 'foundation' | 'safety';

export interface QuizAnswers {
  timeline: TimelineOptionId;
  experience: ExperienceOptionId;
  city: CityOptionId;
}

export interface ResolvedStep {
  kind: StepKind;
  href: string;
  previewTitleKey: string;
  previewBodyKey: string;
  ctaLabelKey: string;
  promotedCtaLabelKey: string;
}

export interface ResolvedCta {
  kind: CtaKind;
  href?: string;
}

export interface ResolvedPlan {
  variant: PlanVariant;
  readiness: ReadinessTier;
  citySlug: Exclude<CityOptionId, 'not_sure'> | null;
  cityIsLive: boolean;
  planNameKey: string;
  summaryKey: string;
  riskKey: string;
  steps: ResolvedStep[];
  primaryCta: ResolvedCta;
  secondaryCta: ResolvedCta;
}

interface ResolvePlanParams {
  answers: QuizAnswers;
  language: string;
}

const READY_EXPERIENCE = new Set<ExperienceOptionId>(['been_before', 'member_somewhere']);
const ORIENTATION_EXPERIENCE = new Set<ExperienceOptionId>(['beginner', 'coffeeshops']);

export function getCitySlug(city: CityOptionId): Exclude<CityOptionId, 'not_sure'> | null {
  return city === 'not_sure' ? null : city;
}

export function resolveReadinessTier(answers: QuizAnswers, cityIsLive: boolean): ReadinessTier {
  if (answers.city === 'not_sure' || answers.timeline === 'few_months' || ORIENTATION_EXPERIENCE.has(answers.experience)) {
    return 'orientation';
  }

  if (cityIsLive && READY_EXPERIENCE.has(answers.experience)) {
    return 'ready';
  }

  return 'planning';
}

export function resolveConciergePlan({ answers, language }: ResolvePlanParams): ResolvedPlan {
  const citySlug = getCitySlug(answers.city);
  const cityIsLive = citySlug === LIVE_CITY_SLUG;
  const readiness = resolveReadinessTier(answers, cityIsLive);
  const variant = resolveVariant(answers, cityIsLive);

  return {
    variant,
    readiness,
    citySlug,
    cityIsLive,
    planNameKey: `landing.concierge_tools.plans.${variant}.name`,
    summaryKey: `landing.concierge_tools.plans.${variant}.summary`,
    riskKey: `landing.concierge_tools.plans.${variant}.risk`,
    steps: resolveSteps({ answers, variant, language, citySlug }),
    primaryCta: resolvePrimaryCta({ variant, language, citySlug }),
    secondaryCta: resolveSecondaryCta({ variant, language, citySlug }),
  };
}

function resolveVariant(answers: QuizAnswers, cityIsLive: boolean): PlanVariant {
  if (answers.city === 'not_sure') {
    return 'city_decider';
  }

  if (!cityIsLive) {
    return 'city_scout';
  }

  if (READY_EXPERIENCE.has(answers.experience) && answers.timeline !== 'few_months') {
    return 'fast_track';
  }

  return 'first_trip';
}

function resolveSteps({
  answers,
  variant,
  language,
  citySlug,
}: {
  answers: QuizAnswers;
  variant: PlanVariant;
  language: string;
  citySlug: Exclude<CityOptionId, 'not_sure'> | null;
}): ResolvedStep[] {
  switch (variant) {
    case 'city_decider':
      return [
        step('foundation', `/${language}/editorial/what-are-cannabis-social-clubs-spain`),
        step('safety', `/${language}/editorial/safety-kit-visitors-spain`),
        step('live_now', `/${language}/spain/barcelona`),
      ];
    case 'first_trip':
      return [
        step(
          answers.experience === 'coffeeshops' ? 'culture_reset' : 'foundation',
          answers.experience === 'coffeeshops'
            ? `/${language}/editorial/barcelona-vs-amsterdam-cannabis`
            : `/${language}/editorial/what-are-cannabis-social-clubs-spain`
        ),
        step('safety', `/${language}/editorial/safety-kit-visitors-spain`),
        step('first_visit', `/${language}/editorial/first-time-barcelona-cannabis-club`),
      ];
    case 'fast_track':
      return [
        step('legal', `/${language}/editorial/spain-cannabis-laws-tourists`),
        step('scams', `/${language}/editorial/scams-red-flags`),
        step('live_city', `/${language}/spain/barcelona/clubs`),
      ];
    case 'city_scout':
      return [
        step('foundation', `/${language}/editorial/what-are-cannabis-social-clubs-spain`),
        step('safety', `/${language}/editorial/safety-kit-visitors-spain`),
        step('city_watch', `/${language}/spain/${citySlug ?? LIVE_CITY_SLUG}`),
      ];
  }
}

function resolvePrimaryCta({
  variant,
  language,
  citySlug,
}: {
  variant: PlanVariant;
  language: string;
  citySlug: Exclude<CityOptionId, 'not_sure'> | null;
}): ResolvedCta {
  switch (variant) {
    case 'city_decider':
    case 'first_trip':
      return { kind: 'email_plan' };
    case 'fast_track':
      return { kind: 'live_city', href: `/${language}/spain/barcelona/clubs` };
    case 'city_scout':
      return { kind: 'city_watch', href: `/${language}/spain/${citySlug ?? LIVE_CITY_SLUG}` };
  }
}

function resolveSecondaryCta({
  variant,
  language,
  citySlug,
}: {
  variant: PlanVariant;
  language: string;
  citySlug: Exclude<CityOptionId, 'not_sure'> | null;
}): ResolvedCta {
  switch (variant) {
    case 'city_decider':
      return { kind: 'safety', href: `/${language}/editorial/safety-kit-visitors-spain` };
    case 'first_trip':
      return { kind: 'live_city', href: `/${language}/spain/barcelona/clubs` };
    case 'fast_track':
      return { kind: 'safety', href: `/${language}/editorial/safety-kit-visitors-spain` };
    case 'city_scout':
      return { kind: 'foundation', href: `/${language}/editorial/what-are-cannabis-social-clubs-spain` };
  }
}

function step(kind: StepKind, href: string): ResolvedStep {
  return {
    kind,
    href,
    previewTitleKey: `landing.concierge_tools.steps.${kind}.title`,
    previewBodyKey: `landing.concierge_tools.steps.${kind}.body`,
    ctaLabelKey: `landing.concierge_tools.steps.${kind}.cta`,
    promotedCtaLabelKey: `landing.concierge_tools.steps.${kind}.promoted_cta`,
  };
}
