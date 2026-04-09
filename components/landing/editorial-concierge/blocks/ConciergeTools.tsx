'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  CheckCircle2, 
  ClipboardList, 
  Mail, 
  ShieldAlert, 
  Sparkles
} from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deliverConciergePlan } from '@/app/actions/lead-capture';
import { cn } from '@/lib/utils';
import {
  resolveConciergePlan,
  type CityOptionId,
  type CtaKind,
  type ExperienceOptionId,
  type PlanVariant,
  type QuestionId,
  type QuizAnswers,
  type ResolvedPlan,
  type ResolvedStep,
  type StepKind,
  type TimelineOptionId,
} from './concierge-tools-plan';

const RESULT_STORAGE_KEY = 'scm.concierge_tools.result';
const TIMELINE_OPTION_IDS: TimelineOptionId[] = ['this_weekend', 'within_month', 'few_months', 'already_here'];
const EXPERIENCE_OPTION_IDS: ExperienceOptionId[] = ['beginner', 'coffeeshops', 'been_before', 'member_somewhere'];
const CITY_OPTION_IDS: CityOptionId[] = ['barcelona', 'madrid', 'valencia', 'tenerife', 'not_sure'];
const MAX_RESTORE_AGE_MS = 1000 * 60 * 60 * 12;

type QuestionOptionId = TimelineOptionId | ExperienceOptionId | CityOptionId;
type SubmitStatus = 'idle' | 'loading' | 'success';
type PersistedResultState = {
  answers: QuizAnswers;
  planVariant: PlanVariant;
  activeStepKind: StepKind | null;
  captureSubmitted: boolean;
  timestamp: number;
};
type PersistedResultStateInput = Omit<PersistedResultState, 'timestamp'>;

export function ConciergeTools() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [activeStepKind, setActiveStepKind] = useState<StepKind | null>(null);

  const questions: Array<{
    id: QuestionId;
    question: string;
    options: Array<{ id: QuestionOptionId; label: string }>;
  }> = [
    {
      id: 'timeline',
      question: t('landing.concierge_tools.questions.timeline.question'),
      options: [
        { id: 'this_weekend', label: t('landing.concierge_tools.questions.timeline.options.this_weekend') },
        { id: 'within_month', label: t('landing.concierge_tools.questions.timeline.options.within_month') },
        { id: 'few_months', label: t('landing.concierge_tools.questions.timeline.options.few_months') },
        { id: 'already_here', label: t('landing.concierge_tools.questions.timeline.options.already_here') },
      ],
    },
    {
      id: 'experience',
      question: t('landing.concierge_tools.questions.experience.question'),
      options: [
        { id: 'beginner', label: t('landing.concierge_tools.questions.experience.options.beginner') },
        { id: 'coffeeshops', label: t('landing.concierge_tools.questions.experience.options.coffeeshops') },
        { id: 'been_before', label: t('landing.concierge_tools.questions.experience.options.been_before') },
        { id: 'member_somewhere', label: t('landing.concierge_tools.questions.experience.options.member_somewhere') },
      ],
    },
    {
      id: 'city',
      question: t('landing.concierge_tools.questions.city.question'),
      options: [
        { id: 'barcelona', label: t('landing.concierge_tools.questions.city.options.barcelona') },
        { id: 'madrid', label: t('landing.concierge_tools.questions.city.options.madrid') },
        { id: 'valencia', label: t('landing.concierge_tools.questions.city.options.valencia') },
        { id: 'tenerife', label: t('landing.concierge_tools.questions.city.options.tenerife') },
        { id: 'not_sure', label: t('landing.concierge_tools.questions.city.options.not_sure') },
      ],
    },
  ];

  const resultStepIndex = questions.length;
  const isComplete = questions.every((question) => Boolean(answers[question.id]));
  const resolvedPlan = isComplete ? resolveConciergePlan({ answers: answers as QuizAnswers, language }) : null;
  const activeStep = resolvedPlan?.steps.find((stepItem) => stepItem.kind === activeStepKind) ?? resolvedPlan?.steps[0] ?? null;

  const answerLabels = questions.flatMap((question) => {
    const selected = answers[question.id];
    const match = question.options.find((option) => option.id === selected);
    return match ? [match.label] : [];
  });

  useEffect(() => {
    const restored = readPersistedResultState();
    if (!restored) return;

    const restoredPlan = resolveConciergePlan({ answers: restored.answers, language });
    if (restored.planVariant !== restoredPlan.variant) {
      clearPersistedResultState();
      return;
    }

    const restoredStepKind = restored.activeStepKind && restoredPlan.steps.some((s) => s.kind === restored.activeStepKind)
        ? restored.activeStepKind
        : restoredPlan.steps[0]?.kind ?? null;

    queueMicrotask(() => {
      setAnswers(restored.answers);
      setStep(resultStepIndex);
      setSubmitStatus(restored.captureSubmitted ? 'success' : 'idle');
      setActiveStepKind(restoredStepKind);

      trackEvent('landing_concierge_state_restore', {
        ...buildPlanPayload(restoredPlan, restored.answers),
        active_step_kind: restoredStepKind ?? 'none',
        capture_submitted: restored.captureSubmitted,
      });
    });
  }, [language, resultStepIndex]);

  useEffect(() => {
    if (step !== resultStepIndex || !resolvedPlan) return;
    persistResultState({
      answers: answers as QuizAnswers,
      planVariant: resolvedPlan.variant,
      activeStepKind,
      captureSubmitted: submitStatus === 'success',
    });
  }, [activeStepKind, answers, resolvedPlan, resultStepIndex, step, submitStatus]);

  const handleAnswer = (questionId: QuestionId, optionId: QuestionOptionId, stepIndex: number) => {
    const nextAnswers = { ...answers, [questionId]: optionId } as Partial<QuizAnswers>;

    if (stepIndex === 0 && Object.keys(answers).length === 0) {
      trackEvent('landing_concierge_quiz_start', { question_count: questions.length });
    }

    trackEvent('landing_concierge_question_answered', {
      question_id: questionId,
      option_id: optionId,
      step_index: stepIndex + 1,
    });

    setAnswers(nextAnswers);

    if (stepIndex < questions.length - 1) {
      setStep(stepIndex + 1);
    } else {
      const plan = resolveConciergePlan({ answers: nextAnswers as QuizAnswers, language });
      setActiveStepKind(plan.steps[0]?.kind ?? null);
      setSubmitStatus('idle');
      setEmail('');
      setStep(resultStepIndex);

      trackEvent('landing_concierge_plan_view', {
        ...buildPlanPayload(plan, nextAnswers as QuizAnswers),
        active_step_kind: plan.steps[0]?.kind ?? 'none',
      });
    }
  };

  const handleReset = () => {
    clearPersistedResultState();
    setAnswers({});
    setEmail('');
    setSubmitStatus('idle');
    setActiveStepKind(null);
    setStep(0);
  };

  const handlePlanSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedPlan || !email.trim()) return;

    const payload = buildPlanPayload(resolvedPlan, answers as QuizAnswers);
    const fallbackPath = activeStep?.href || resolvedPlan.primaryCta.href || resolvedPlan.steps[0]?.href || `/${language}/editorial/what-are-cannabis-social-clubs-spain`;

    setSubmitStatus('loading');
    trackEvent('landing_concierge_plan_submit_attempt', { ...payload, email_length: email.trim().length });

    try {
      const result = await deliverConciergePlan({
        email: email.trim(),
        locale: language,
        planName: t(resolvedPlan.planNameKey),
        summary: t(resolvedPlan.summaryKey),
        primaryHref: fallbackPath,
        steps: resolvedPlan.steps.map((stepItem) => ({
          title: t(getStepTranslationKey(stepItem, 'title')),
          href: stepItem.href,
        })),
      });

      if (result.deliveryMode === 'direct') {
        trackEvent('landing_concierge_plan_submit_fallback', { ...payload, source: 'landing_concierge_tools', fallback_path: result.fallbackPath });
        router.push(result.fallbackPath);
        return;
      }

      setSubmitStatus('success');
      trackEvent('landing_concierge_plan_submit_success', { ...payload, source: 'landing_concierge_tools', delivery_mode: 'email' });
    } catch (error) {
      console.error('Concierge plan delivery failed:', error);
      router.push(fallbackPath);
    }
  };

  const trackPreviewLinkClick = (stepItem: ResolvedStep, positionIndex: number) => {
    if (!resolvedPlan) return;
    trackEvent(
      submitStatus === 'success' ? 'landing_concierge_preview_link_click_after_submit' : 'landing_concierge_preview_link_click_before_submit',
      { ...buildPlanPayload(resolvedPlan, answers as QuizAnswers), step_kind: stepItem.kind, position_index: positionIndex, destination: stepItem.href }
    );
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-24 bg-background flex items-center min-h-[100dvh] md:min-h-0">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,201,177,0.06),transparent)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col">
        
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            {t('landing.concierge_tools.eyebrow')}
          </div>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            {t('landing.concierge_tools.title')}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('landing.concierge_tools.subtitle')}
          </p>
        </div>

        <div className="relative w-full min-h-[550px] flex flex-col rounded-[2.5rem] border border-border/60 bg-[#0A0C10]/60 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
          <AnimatePresence mode="wait">
            
            {step < resultStepIndex ? (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-8 md:p-12 lg:p-16"
              >
                <div className="mb-10 flex items-center gap-3">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        idx === step ? "w-12 bg-brand shadow-[0_0_10px_rgba(0,201,177,0.4)]" : idx < step ? "w-6 bg-brand/30" : "w-6 bg-border/60"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Step {step + 1}/{questions.length}
                  </span>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-12 md:gap-20 items-center">
                  <div className="w-full md:w-1/2">
                    <motion.h3
                      key={`heading-${step}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-foreground"
                    >
                      {questions[step].question}
                    </motion.h3>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col gap-4">
                    {questions[step].options.map((option, idx) => (
                      <motion.button
                        key={option.id}
                        type="button"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleAnswer(questions[step].id, option.id, step)}
                        className="group flex w-full items-center justify-between rounded-2xl border border-border/50 bg-background/40 p-5 transition-all hover:border-brand/40 hover:bg-brand/5 focus:outline-none focus:ring-2 focus:ring-brand/50"
                      >
                        <span className="text-base font-bold text-foreground transition-colors group-hover:text-brand">
                          {option.label}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border/40 text-muted-foreground transition-all group-hover:bg-brand group-hover:text-primary-foreground">
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              resolvedPlan && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col md:flex-row min-h-[550px]"
                >
                  {/* LEFT COLUMN */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col border-b md:border-b-0 md:border-r border-border/50">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand mb-6">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('landing.concierge_tools.result.ready')}
                      </div>
                      
                      <h3 className="text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
                        {t(resolvedPlan.planNameKey)}
                      </h3>
                      
                      <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-md">
                        {t(resolvedPlan.summaryKey)}
                      </p>

                      <div className="rounded-[1.25rem] border border-destructive/20 bg-[#1A0B0E]/60 p-5 mb-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-destructive/40" />
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldAlert className="h-4 w-4 text-destructive" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-destructive">
                            {t('landing.concierge_tools.result.risk_label')}
                          </p>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                          {t(resolvedPlan.riskKey)}
                        </p>
                      </div>
                    </div>

                    {renderCaptureCard({ t, email, setEmail, submitStatus, onSubmit: handlePlanSubmit })}
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 bg-black/20 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('landing.concierge_tools.result.preview_label')}
                      </h4>
                      <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        {t('landing.concierge_tools.restart')}
                      </button>
                    </div>

                    <div className="flex flex-col gap-5">
                      {resolvedPlan.steps.map((stepItem, idx) => (
                        <Link
                          key={stepItem.kind}
                          href={stepItem.href}
                          onClick={() => trackPreviewLinkClick(stepItem, idx + 1)}
                          className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-brand/40 hover:bg-white/[0.04] hover:-translate-y-1 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-xs font-black text-muted-foreground group-hover:bg-brand group-hover:text-primary-foreground group-hover:border-transparent transition-all">
                                {idx + 1}
                              </span>
                              <h5 className="font-bold text-lg text-foreground transition-colors group-hover:text-brand">
                                {t(getStepTranslationKey(stepItem, 'title'))}
                              </h5>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                          </div>
                          <p className="pl-12 text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            {t(getStepTranslationKey(stepItem, 'body'))}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function renderCaptureCard({
  t,
  email,
  setEmail,
  submitStatus,
  onSubmit,
}: {
  t: (key: string) => string;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  submitStatus: SubmitStatus;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div className="rounded-[1.5rem] border border-brand/20 bg-[#090D14]/80 p-6 md:p-8 shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,201,177,0.1),transparent_50%)] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <Mail className="h-4 w-4 text-brand" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand">
            {t('landing.concierge_tools.capture.title')}
          </p>
        </div>
        <p className="text-[13px] text-foreground/70 mb-6 leading-relaxed">
          {submitStatus === 'success' ? t('landing.concierge_tools.capture.success_body') : t('landing.concierge_tools.capture.body')}
        </p>
        
        {submitStatus === 'success' ? (
          <div className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/10 p-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand mb-1">
                {t('landing.concierge_tools.capture.success_title')}
              </p>
              <p className="text-xs text-brand/80 leading-snug">{t('landing.concierge_tools.capture.microcopy')}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('landing.concierge_tools.capture.email_placeholder')}
              className="h-12 w-full rounded-xl border-white/10 bg-black/40 px-4 text-sm text-white placeholder:text-muted-foreground focus-visible:ring-brand/50 transition-all"
            />
            <Button 
              type="submit" 
              className="h-12 w-full rounded-xl bg-white text-black hover:bg-brand hover:text-primary-foreground font-black transition-all shadow-md active:scale-[0.98]"
              disabled={submitStatus === 'loading'}
            >
              {submitStatus === 'loading' ? t('landing.concierge_tools.capture.loading') : t('landing.concierge_tools.capture.submit')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function buildPlanPayload(plan: ResolvedPlan, answers: QuizAnswers) {
  return {
    plan_variant: plan.variant,
    readiness_tier: plan.readiness,
    timeline_id: answers.timeline,
    experience_id: answers.experience,
    city_id: answers.city,
    city_live: plan.cityIsLive,
  };
}

function getStepTranslationKey(
  step: Pick<ResolvedStep, 'kind'> & Partial<ResolvedStep>,
  field: 'title' | 'body' | 'cta' | 'promoted_cta'
) {
  switch (field) {
    case 'title': return step.previewTitleKey ?? `landing.concierge_tools.steps.${step.kind}.title`;
    case 'body': return step.previewBodyKey ?? `landing.concierge_tools.steps.${step.kind}.body`;
    case 'cta': return step.ctaLabelKey ?? `landing.concierge_tools.steps.${step.kind}.cta`;
    case 'promoted_cta': return step.promotedCtaLabelKey ?? `landing.concierge_tools.steps.${step.kind}.promoted_cta`;
  }
}

function readPersistedResultState(): PersistedResultState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedResultState(parsed)) {
      window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
      return null;
    }
    if (Date.now() - parsed.timestamp > MAX_RESTORE_AGE_MS) {
      window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistResultState(state: PersistedResultStateInput) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(
    RESULT_STORAGE_KEY,
    JSON.stringify({
      ...state,
      timestamp: Date.now(),
    } satisfies PersistedResultState)
  );
}

function clearPersistedResultState() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
}

function isPersistedResultState(value: unknown): value is PersistedResultState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PersistedResultState>;
  return (
    isQuizAnswers(candidate.answers) &&
    typeof candidate.planVariant === 'string' &&
    (candidate.activeStepKind === null || typeof candidate.activeStepKind === 'string') &&
    typeof candidate.captureSubmitted === 'boolean' &&
    typeof candidate.timestamp === 'number' &&
    Number.isFinite(candidate.timestamp)
  );
}

function isQuizAnswers(value: unknown): value is QuizAnswers {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<QuizAnswers>;
  return (
    typeof candidate.timeline === 'string' &&
    TIMELINE_OPTION_IDS.includes(candidate.timeline as TimelineOptionId) &&
    typeof candidate.experience === 'string' &&
    EXPERIENCE_OPTION_IDS.includes(candidate.experience as ExperienceOptionId) &&
    typeof candidate.city === 'string' &&
    CITY_OPTION_IDS.includes(candidate.city as CityOptionId)
  );
}