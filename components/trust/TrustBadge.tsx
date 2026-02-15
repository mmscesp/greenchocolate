import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'verified' | 'expert' | 'privacy';
type BadgeTheme = 'light' | 'dark';

interface TrustBadgeProps {
  variant: BadgeVariant;
  theme?: BadgeTheme;
  className?: string;
}

const variants = {
  light: {
    verified: {
      icon: CheckCircle2,
      text: 'License Verified',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    expert: {
      icon: ShieldCheck,
      text: 'Expert Reviewed',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    privacy: {
      icon: Lock,
      text: 'Privacy Guaranteed',
      className: 'bg-zinc-100 text-zinc-800 border-zinc-200'
    }
  },
  dark: {
    verified: {
      icon: CheckCircle2,
      text: 'License Verified',
      className: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    expert: {
      icon: ShieldCheck,
      text: 'Expert Reviewed',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    privacy: {
      icon: Lock,
      text: 'Privacy Guaranteed',
      className: 'bg-white/10 text-zinc-300 border-white/20'
    }
  }
};

export default function TrustBadge({ variant, theme = 'light', className }: TrustBadgeProps) {
  const config = variants[theme][variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all hover:shadow-sm cursor-default",
      config.className,
      className
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.text}</span>
    </div>
  );
}
