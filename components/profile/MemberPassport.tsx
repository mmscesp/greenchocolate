'use client';

import { motion } from 'framer-motion';
import { Fingerprint, Shield, Calendar, Clock, CheckCircle2, FileCheck, UserCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import TrustBadge from '@/components/trust/TrustBadge';

interface MemberPassportProps {
  email: string;
  verificationId: string;
  verifiedAt?: Date;
  tier?: 'standard' | 'premium' | 'elite';
  className?: string;
}

export default function MemberPassport({ 
  email, 
  verificationId, 
  verifiedAt = new Date(), 
  tier = 'standard',
  className 
}: MemberPassportProps) {
  const tierConfig = {
    standard: {
      label: 'VERIFIED MEMBER',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-600',
      accentBg: 'bg-emerald-500/10',
      bar: 'bg-emerald-500'
    },
    premium: {
      label: 'PREMIUM ACCESS',
      gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
      border: 'border-amber-500/30',
      accent: 'text-amber-600',
      accentBg: 'bg-amber-500/10',
      bar: 'bg-amber-500'
    },
    elite: {
      label: 'ELITE CIRCLE',
      gradient: 'from-purple-500/20 via-violet-500/10 to-fuchsia-500/20',
      border: 'border-purple-500/30',
      accent: 'text-purple-600',
      accentBg: 'bg-purple-500/10',
      bar: 'bg-purple-500'
    }
  };

  const config = tierConfig[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 shadow-xl",
        "bg-gradient-to-br",
        config.gradient,
        config.border,
        className
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      
      {/* Top accent bar */}
      <div className={cn("h-1.5 w-full", config.bar)} />
      
      <div className="p-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("p-2 rounded-xl", config.accentBg)}>
                <FileCheck className={cn("h-6 w-6", config.accent)} />
              </div>
              <TrustBadge type="verified" size="sm" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Member Passport</h3>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-1">
              Barcelona CSC Network • 2026
            </p>
          </div>
          
          {/* QR Code Placeholder */}
          <div className={cn(
            "w-16 h-16 rounded-xl p-2 shadow-lg border-2",
            "bg-white",
            config.border
          )}>
            <div className="w-full h-full rounded-lg flex items-center justify-center bg-muted">
              <Fingerprint className={cn("h-7 w-7", config.accent)} />
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border",
          "bg-white/50 dark:bg-black/20",
          config.border
        )}>
          <CheckCircle2 className={cn("h-4 w-4", config.accent)} />
          <span className={cn("text-xs font-bold uppercase tracking-widest", config.accent)}>
            {config.label}
          </span>
        </div>

        {/* Member Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/50 border border-border/50">
            <UserCheck className={cn("h-5 w-5 shrink-0", config.accent)} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Registered Member</p>
              <p className="text-foreground font-mono text-sm font-medium truncate">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/50 border border-border/50">
            <Shield className={cn("h-5 w-5 shrink-0", config.accent)} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Verification ID</p>
              <p className="text-foreground font-mono text-sm font-medium truncate">{verificationId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/50 border border-border/50">
            <Calendar className={cn("h-5 w-5 shrink-0", config.accent)} />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Valid Until</p>
              <p className="text-foreground font-mono text-sm font-medium">
                {new Date(verifiedAt.getFullYear() + 1, verifiedAt.getMonth(), verifiedAt.getDate()).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className={cn("h-3.5 w-3.5", config.accent)} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AES-256 Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                Issued {verifiedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner decoration */}
      <div className={cn("absolute -bottom-6 -right-6 opacity-[0.08] pointer-events-none", config.accent)}>
        <Fingerprint className="h-32 w-32" />
      </div>
    </motion.div>
  );
}
