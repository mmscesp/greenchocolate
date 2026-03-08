'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, ClipboardList, Mail, ShieldAlert, Sparkles } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [activeStepKind, setActiveStepKind] = useState<StepKind | null>(null);
  const [restoredFromSession, setRestoredFromSession] = useState(false);

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
  const answerLabels = questions.flatMap((question) => {
    const selected = answers[question.id];
    const match = question.options.find((option) => option.id === selected);
    return match ? [match.label] : [];
  });
  const proofItems = [
    t('landing.trust_strip.items.verified_only'),
    t('landing.trust_strip.items.updated_weekly'),
    t('landing.trust_strip.items.zero_paid_placements'),
  ];
  const activeStep = resolvedPlan?.steps.find((stepItem) => stepItem.kind === activeStepKind) ?? resolvedPlan?.steps[0] ?? null;

  useEffect(() => {
    const restored = readPersistedResultState();
    if (!restored) return;

    const restoredPlan = resolveConciergePlan({
      answers: restored.answers,
      language,
    });

    if (restored.planVariant !== restoredPlan.variant) {
      clearPersistedResultState();
      return;
    }

    const restoredStepKind =
      restored.activeStepKind && restoredPlan.steps.some((stepItem) => stepItem.kind === restored.activeStepKind)
        ? restored.activeStepKind
        : restoredPlan.steps[0]?.kind ?? null;

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setAnswers(restored.answers);
      setStep(resultStepIndex);
      setSubmitStatus(restored.captureSubmitted ? 'success' : 'idle');
      setActiveStepKind(restoredStepKind);
      setRestoredFromSession(true);

      trackEvent('landing_concierge_state_restore', {
        ...buildPlanPayload(restoredPlan, restored.answers),
        active_step_kind: restoredStepKind ?? 'none',
        capture_submitted: restored.captureSubmitted,
        age_seconds: Math.max(0, Math.round((Date.now() - restored.timestamp) / 1000)),
      });
    });

    return () => {
      cancelled = true;
    };
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
      trackEvent('landing_concierge_quiz_start', {
        question_count: questions.length,
      });
    }

    trackEvent('landing_concierge_question_answered', {
      question_id: questionId,
      option_id: optionId,
      step_index: stepIndex + 1,
    });

    setAnswers(nextAnswers);
    setRestoredFromSession(false);

    if (stepIndex < questions.length - 1) {
      setStep(stepIndex + 1);
      return;
    }

    const plan = resolveConciergePlan({
      answers: nextAnswers as QuizAnswers,
      language,
    });
    const initialActiveStep = plan.steps[0]?.kind ?? null;

    setActiveStepKind(initialActiveStep);
    setSubmitStatus('idle');
    setEmail('');
    setStep(resultStepIndex);

    trackEvent('landing_concierge_plan_view', {
      ...buildPlanPayload(plan, nextAnswers as QuizAnswers),
      active_step_kind: initialActiveStep ?? 'none',
    });
  };

  const handleReset = () => {
    clearPersistedResultState();
    setAnswers({});
    setEmail('');
    setSubmitStatus('idle');
    setActiveStepKind(null);
    setRestoredFromSession(false);
    setStep(0);
  };

  const handlePlanSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resolvedPlan || !email.trim()) return;

    const payload = buildPlanPayload(resolvedPlan, answers as QuizAnswers);
    setSubmitStatus('loading');

    trackEvent('landing_concierge_plan_submit_attempt', {
      ...payload,
      email_length: email.trim().length,
    });

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    setSubmitStatus('success');
    trackEvent('landing_concierge_plan_submit_success', {
      ...payload,
      source: 'landing_concierge_tools',
    });
  };

  const handlePreviewToggle = (stepItem: ResolvedStep, positionIndex: number) => {
    if (!resolvedPlan) return;

    const isCurrentlyOpen = activeStepKind === stepItem.kind;

    if (activeStepKind && activeStepKind !== stepItem.kind) {
      trackEvent('landing_concierge_preview_toggle', {
        ...buildPlanPayload(resolvedPlan, answers as QuizAnswers),
        step_kind: activeStepKind,
        position_index: resolvedPlan.steps.findIndex((entry) => entry.kind === activeStepKind) + 1,
        opened: false,
      });
    }

    const nextStepKind = isCurrentlyOpen ? null : stepItem.kind;
    setActiveStepKind(nextStepKind);

    trackEvent('landing_concierge_preview_toggle', {
      ...buildPlanPayload(resolvedPlan, answers as QuizAnswers),
      step_kind: stepItem.kind,
      position_index: positionIndex,
      opened: !isCurrentlyOpen,
    });
  };

  const trackPreviewLinkClick = (stepItem: ResolvedStep, positionIndex: number) => {
    if (!resolvedPlan) return;

    trackEvent(
      submitStatus === 'success'
        ? 'landing_concierge_preview_link_click_after_submit'
        : 'landing_concierge_preview_link_click_before_submit',
      {
        ...buildPlanPayload(resolvedPlan, answers as QuizAnswers),
        step_kind: stepItem.kind,
        position_index: positionIndex,
        destination: stepItem.href,
      }
    );
  };

  const trackContinuationClick = (
    role: 'post_submit_primary' | 'post_submit_secondary',
    kind: CtaKind | StepKind,
    destination: string
  ) => {
    if (!resolvedPlan) return;

    trackEvent('landing_concierge_cta_click', {
      ...buildPlanPayload(resolvedPlan, answers as QuizAnswers),
      cta_role: role,
      cta_kind: kind,
      destination,
    });
  };

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[radial-gradient(circle_at_top,rgba(194,165,108,0.14),transparent_24%),linear-gradient(180deg,#050608_0%,#090b0f_100%)] px-4 py-24 md:px-8 md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="mx-auto mb-12 max-w-3xl text-center"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
            <Sparkles className="h-4 w-4" />
            {t('landing.concierge_tools.eyebrow')}
          </span>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            {t('landing.concierge_tools.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-2xl">
            {t('landing.concierge_tools.subtitle')}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
            {t('landing.concierge_tools.intro')}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-200">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{t('landing.concierge_tools.signals.zero_guesswork')}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{t('landing.concierge_tools.signals.avoid_traps')}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{t('landing.concierge_tools.signals.next_move')}</span>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,16,22,0.98),rgba(8,10,14,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(194,165,108,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative z-10 p-6 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {step < resultStepIndex ? (
                <motion.div
                  key={`question-${step}`}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: 0.28 }}
                  className="min-h-[480px]"
                >
                  <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                        <ClipboardList className="h-4 w-4 text-brand" />
                        {t('landing.concierge_tools.builder_badge')}
                      </span>
                      <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
                        {t('landing.concierge_tools.builder_helper')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 md:justify-end">
                      {questions.map((question, index) => (
                        <div
                          key={question.id}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === step ? 'w-14 bg-brand' : index < step ? 'w-6 bg-brand/55' : 'w-6 bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                        {t('landing.concierge_tools.step_label')} {step + 1}/{questions.length}
                      </p>
                      <h3 className="max-w-xl text-3xl font-black leading-tight text-white md:text-5xl">
                        {questions[step].question}
                      </h3>
                    </div>

                    <div className="grid gap-3">
                      {questions[step].options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleAnswer(questions[step].id, option.id, step)}
                          className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 text-left transition-all duration-200 hover:border-brand/40 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-brand/50 active:scale-[0.99]"
                        >
                          <span className="flex items-center justify-between gap-4">
                            <span className="text-base font-bold leading-snug text-white md:text-lg">{option.label}</span>
                            <ArrowRight className="h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                resolvedPlan && (
                  <motion.div
                    key="result"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-8"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('landing.concierge_tools.result.ready')}
                      </span>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-300">
                        {t(`landing.concierge_tools.readiness.${resolvedPlan.readiness}`)}
                      </span>
                      {restoredFromSession ? (
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-300">
                          {t('landing.concierge_tools.result.restored')}
                        </span>
                      ) : null}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
                      <div className="grid gap-4">
                        <div className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.02] p-6 md:p-8 group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-brand/0 to-brand/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:from-brand/10 group-hover:to-brand/5 group-hover:opacity-100 transition-all duration-500 -z-10" />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative z-10">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                              {t('landing.concierge_tools.result.selected_for_you')}
                            </p>
                            <h3 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                              {t(resolvedPlan.planNameKey)}
                            </h3>
                            <p className="mt-4 text-base leading-relaxed text-zinc-300 md:text-lg">
                              {t(resolvedPlan.summaryKey)}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                              {answerLabels.map((label) => (
                                <span
                                  key={label}
                                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-200"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {renderCaptureCard({
                          t,
                          email,
                          setEmail,
                          submitStatus,
                          onSubmit: handlePlanSubmit,
                        })}

                        {submitStatus === 'success' && activeStep ? (
                          <div className="relative overflow-hidden rounded-[1.65rem] border border-brand/30 bg-brand/5 p-6 md:p-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,165,108,0.15),transparent_50%)]" />
                            <div className="relative z-10">
                              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                                {t('landing.concierge_tools.capture.next_title')}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                                {t('landing.concierge_tools.capture.next_body')}
                              </p>

                              <div className="mt-6 grid gap-3">
                                <Button asChild size="lg" className="w-full justify-between bg-brand text-black hover:bg-brand/90 font-bold shadow-[0_0_20px_rgba(194,165,108,0.2)] transition-all hover:shadow-[0_0_30px_rgba(194,165,108,0.4)]">
                                  <Link
                                    href={activeStep.href}
                                    onClick={() => trackContinuationClick('post_submit_primary', activeStep.kind, activeStep.href)}
                                  >
                                    {t(getStepTranslationKey(activeStep, 'promoted_cta'))}
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </Button>

                                {resolvedPlan.secondaryCta.href ? (
                                  <Button asChild variant="secondary" size="lg" className="w-full justify-between border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                    <Link
                                      href={resolvedPlan.secondaryCta.href}
                                      onClick={() =>
                                        trackContinuationClick(
                                          'post_submit_secondary',
                                          resolvedPlan.secondaryCta.kind,
                                          resolvedPlan.secondaryCta.href ?? `/${language}/editorial/safety-kit-visitors-spain`
                                        )
                                      }
                                    >
                                      {t(getCtaLabelKey(resolvedPlan.secondaryCta.kind))}
                                      <ArrowRight className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-5">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                              {t('landing.concierge_tools.result.risk_label')}
                            </p>
                            <div className="flex items-start gap-3">
                              <ShieldAlert className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                              <p className="text-xs leading-relaxed text-zinc-300">
                                {t(resolvedPlan.riskKey)}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-5">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
                              {t('landing.concierge_tools.result.proof_label')}
                            </p>
                            <div className="flex flex-col gap-2">
                              {proofItems.map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-brand/70 shrink-0" />
                                  <span className="text-xs font-medium text-zinc-300">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleReset}
                          className="justify-center text-zinc-400 hover:text-brand"
                        >
                          {t('landing.concierge_tools.restart')}
                        </Button>
                      </div>

                      <div className="sticky top-24 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 md:p-6 shadow-2xl">
                        <div className="mb-5 border-b border-white/10 pb-5">
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                            {t('landing.concierge_tools.result.preview_label')}
                          </p>
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                            {submitStatus === 'success'
                              ? t('landing.concierge_tools.result.preview_helper_after_submit')
                              : t('landing.concierge_tools.result.preview_helper_before_submit')}
                          </p>
                        </div>

                        <div className="grid gap-3">
                          {resolvedPlan.steps.map((stepItem, index) => {
                            const isOpen = activeStepKind === stepItem.kind;

                            return (
                              <div
                                key={`${stepItem.kind}-${stepItem.href}`}
                                className={`overflow-hidden rounded-[1.4rem] border transition-colors duration-200 ${
                                  isOpen ? 'border-brand/40 bg-white/[0.06]' : 'border-white/10 bg-white/[0.02]'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handlePreviewToggle(stepItem, index + 1)}
                                  className="flex w-full items-center gap-4 px-5 py-5 text-left"
                                >
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-black text-zinc-200">
                                    {index + 1}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-base font-bold text-white">
                                      {t(getStepTranslationKey(stepItem, 'title'))}
                                    </p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                      {t('landing.concierge_tools.result.steps_label')} {index + 1}
                                    </p>
                                  </div>

                                  <span
                                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-transform duration-200 ${
                                      isOpen ? 'rotate-180 text-brand' : ''
                                    }`}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </span>
                                </button>

                                <AnimatePresence initial={false}>
                                  {isOpen ? (
                                    <motion.div
                                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                      transition={{ duration: 0.22 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="border-t border-white/10 px-5 py-5">
                                        <p className="text-sm leading-relaxed text-zinc-300">
                                          {t(getStepTranslationKey(stepItem, 'body'))}
                                        </p>

                                        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                          {submitStatus === 'success' ? (
                                            <Button asChild variant="secondary" size="md" className="w-full md:w-auto">
                                              <Link
                                                href={stepItem.href}
                                                onClick={() => trackPreviewLinkClick(stepItem, index + 1)}
                                              >
                                                {t(getStepTranslationKey(stepItem, 'promoted_cta'))}
                                              </Link>
                                            </Button>
                                          ) : (
                                            <Link
                                              href={stepItem.href}
                                              onClick={() => trackPreviewLinkClick(stepItem, index + 1)}
                                              className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-zinc-100"
                                            >
                                              {t(getStepTranslationKey(stepItem, 'cta'))}
                                              <ArrowRight className="h-4 w-4" />
                                            </Link>
                                          )}

                                          <p className="text-xs leading-relaxed text-zinc-500 md:max-w-[240px] md:text-right">
                                            {submitStatus === 'success'
                                              ? t('landing.concierge_tools.result.preview_helper_after_submit')
                                              : t('landing.concierge_tools.result.preview_helper_before_submit')}
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ) : null}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
    <div className="relative overflow-hidden rounded-[1.65rem] border border-brand/40 bg-[linear-gradient(180deg,rgba(194,165,108,0.15),rgba(10,10,10,0.8))] p-6 md:p-8 shadow-[0_0_40px_rgba(194,165,108,0.15)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
        {t('landing.concierge_tools.capture.title')}
      </p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-200 md:text-base">
        {submitStatus === 'success'
          ? t('landing.concierge_tools.capture.success_body')
          : t('landing.concierge_tools.capture.body')}
      </p>

      {submitStatus === 'success' ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-brand/15 p-2 text-brand">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-100">
                {t('landing.concierge_tools.capture.success_title')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                {t('landing.concierge_tools.capture.success_body')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 grid gap-3">
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('landing.concierge_tools.capture.email_placeholder')}
            className="h-12 border-white/10 bg-black/20 text-base text-white placeholder:text-zinc-500"
          />
          <Button type="submit" size="lg" className="justify-between bg-brand text-black hover:bg-brand/90 font-bold shadow-[0_0_20px_rgba(194,165,108,0.3)] transition-all hover:shadow-[0_0_30px_rgba(194,165,108,0.5)]" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading'
              ? t('landing.concierge_tools.capture.loading')
              : t('landing.concierge_tools.capture.submit')}
            <Mail className="h-4 w-4" />
          </Button>
          <p className="text-xs leading-relaxed text-zinc-400">{t('landing.concierge_tools.capture.microcopy')}</p>
        </form>
      )}
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

function getCtaLabelKey(kind: CtaKind) {
  switch (kind) {
    case 'email_plan':
      return 'landing.concierge_tools.ctas.email_plan';
    case 'live_city':
      return 'landing.concierge_tools.ctas.live_city';
    case 'city_watch':
      return 'landing.concierge_tools.ctas.city_watch';
    case 'foundation':
      return 'landing.concierge_tools.ctas.foundation';
    case 'safety':
      return 'landing.concierge_tools.ctas.safety';
  }
}

function getStepTranslationKey(
  step: Pick<ResolvedStep, 'kind'> & Partial<ResolvedStep>,
  field: 'title' | 'body' | 'cta' | 'promoted_cta'
) {
  switch (field) {
    case 'title':
      return step.previewTitleKey ?? `landing.concierge_tools.steps.${step.kind}.title`;
    case 'body':
      return step.previewBodyKey ?? `landing.concierge_tools.steps.${step.kind}.body`;
    case 'cta':
      return step.ctaLabelKey ?? `landing.concierge_tools.steps.${step.kind}.cta`;
    case 'promoted_cta':
      return step.promotedCtaLabelKey ?? `landing.concierge_tools.steps.${step.kind}.promoted_cta`;
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
