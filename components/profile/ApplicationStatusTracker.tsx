'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, FileSearch, Shield, UserCheck, AlertCircle } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

type ApplicationStatus = 'draft' | 'submitted' | 'reviewing' | 'background_check' | 'approved' | 'rejected';

interface ApplicationStatusTrackerProps {
  status: ApplicationStatus;
  submittedAt?: Date;
  estimatedCompletion?: Date;
  className?: string;
}

interface Stage {
  id: ApplicationStatus;
  labelKey: string;
  descriptionKey: string;
  icon: typeof CheckCircle2;
}

const stages: Stage[] = [
  {
    id: 'submitted',
    labelKey: 'application_status.stages.submitted.label',
    descriptionKey: 'application_status.stages.submitted.description',
    icon: FileSearch
  },
  {
    id: 'reviewing',
    labelKey: 'application_status.stages.reviewing.label',
    descriptionKey: 'application_status.stages.reviewing.description',
    icon: Shield
  },
  {
    id: 'background_check',
    labelKey: 'application_status.stages.background_check.label',
    descriptionKey: 'application_status.stages.background_check.description',
    icon: UserCheck
  },
  {
    id: 'approved',
    labelKey: 'application_status.stages.approved.label',
    descriptionKey: 'application_status.stages.approved.description',
    icon: CheckCircle2
  }
];

export default function ApplicationStatusTracker({
  status,
  submittedAt = new Date(),
  estimatedCompletion,
  className
}: ApplicationStatusTrackerProps) {
  const { t } = useLanguage();

  const getStageIndex = (s: ApplicationStatus) => {
    if (s === 'draft') return -1;
    if (s === 'rejected') return stages.length;
    return stages.findIndex(stage => stage.id === s);
  };

  const currentStageIndex = getStageIndex(status);
  const progressPercentage = Math.max(0, Math.min(100, (currentStageIndex / (stages.length - 1)) * 100));

  const isRejected = status === 'rejected';

  return (
    <div className={cn("bg-card rounded-2xl border border-border shadow-lg p-6", className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{t('application_status.title')}</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          {t('application_status.subtitle')}
        </p>
      </div>

      {/* Progress Bar */}
      {isRejected ? (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-destructive font-bold">{t('application_status.rejected.title')}</p>
              <p className="text-destructive/70 text-sm">{t('application_status.rejected.description')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{t('application_status.progress')}</span>
            <span className="text-xs font-mono font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
            />
          </div>
          {estimatedCompletion && (
            <p className="text-[10px] text-muted-foreground mt-2 text-right">
              {t('application_status.estimated_completion')}: {estimatedCompletion.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </p>
          )}
        </div>
      )}

      {/* Stages */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border transition-all duration-300",
                isCompleted && "bg-primary/5 border-primary/20",
                isCurrent && "bg-amber-500/5 border-amber-500/30",
                isPending && "bg-muted/30 border-border/50 opacity-60"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-amber-500 text-white",
                isPending && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={cn(
                    "font-bold text-sm",
                    isCompleted && "text-foreground",
                    isCurrent && "text-amber-600",
                    isPending && "text-muted-foreground"
                  )}>
                    {t(stage.labelKey)}
                  </h4>
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] uppercase tracking-wider rounded-full font-bold">
                      {t('application_status.current')}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">{t(stage.descriptionKey)}</p>
              </div>

              {isCurrent && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-amber-500 rounded-full shrink-0 mt-2"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="mt-6 pt-5 border-t border-border/50">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
          <span>{t('application_status.submitted')}: {submittedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          {currentStageIndex >= 0 && currentStageIndex < stages.length && (
            <span>{t('application_status.stage')} {currentStageIndex + 1} {t('application_status.of')} {stages.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}
