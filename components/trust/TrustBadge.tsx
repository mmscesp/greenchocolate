'use client';

'use client';

import { Shield, Lock, CheckCircle2, AlertTriangle } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface TrustBadgeProps {
  type: 'encrypted' | 'verified' | 'legal' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TrustBadge({ type, size = 'md', className }: TrustBadgeProps) {
  const { t } = useLanguage();

  const configs = {
    encrypted: {
      icon: Lock,
      text: t('badges.encrypted'),
      bg: 'bg-brand/10',
      border: 'border-brand/20',
      text_color: 'text-brand',
      pulse: true
    },
    verified: {
      icon: CheckCircle2,
      text: t('badges.verified'),
      bg: 'bg-brand/10',
      border: 'border-brand/20',
      text_color: 'text-brand',
      pulse: false
    },
    legal: {
      icon: Shield,
      text: t('badges.legal'),
      bg: 'bg-brand/10',
      border: 'border-brand/20',
      text_color: 'text-brand',
      pulse: false
    },
    warning: {
      icon: AlertTriangle,
      text: t('badges.warning'),
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text_color: 'text-red-500',
      pulse: true
    }
  };

  const config = configs[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-[10px] py-0.5 px-2 gap-1',
    md: 'text-xs py-1 px-3 gap-1.5',
    lg: 'text-sm py-1.5 px-4 gap-2'
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border font-mono tracking-wider font-semibold select-none",
      config.bg,
      config.border,
      config.text_color,
      sizeClasses[size],
      className
    )}>
      <Icon className={cn(
        "relative z-10",
        size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'
      )} />
      
      <span>{config.text}</span>
      
      {config.pulse && (
        <span className="relative flex h-2 w-2 ml-1">
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.text_color, "bg-current")}></span>
          <span className={cn("relative inline-flex rounded-full h-2 w-2", config.text_color, "bg-current")}></span>
        </span>
      )}
    </div>
  );
}

