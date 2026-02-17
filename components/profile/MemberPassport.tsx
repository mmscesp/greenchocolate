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
      color: 'border-primary/30',
      bgColor: 'bg-primary/5',
      accent: 'text-primary'
    },
    premium: {
      label: 'PREMIUM ACCESS',
      color: 'border-accent/30',
      bgColor: 'bg-accent/5',
      accent: 'text-accent'
    },
    elite: {
      label: 'ELITE CIRCLE',
      color: 'border-purple-500/30',
      bgColor: 'bg-purple-500/5',
      accent: 'text-purple-400'
    }
  };

  const config = tierConfig[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-midnight-charcoal border-2 shadow-2xl",
        config.color,
        className
      )}
    >
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-50" />
      
      {/* Top accent bar */}
      <div className={cn("h-2 w-full", tier === 'standard' ? 'bg-primary' : tier === 'premium' ? 'bg-accent' : 'bg-purple-500')} />
      
      <div className="p-8 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("p-2 rounded-lg", config.bgColor)}>
                <FileCheck className={cn("h-6 w-6", config.accent)} />
              </div>
              <TrustBadge type="verified" size="sm" />
            </div>
            <h3 className="text-2xl font-serif text-white">Safety Pass</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Barcelona CSC Network • 2026
            </p>
          </div>
          
          {/* QR Code Placeholder */}
          <div className="w-20 h-20 bg-white rounded-lg p-2 shadow-lg">
            <div className="w-full h-full bg-midnight-charcoal rounded flex items-center justify-center">
              <Fingerprint className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border",
          config.bgColor,
          config.color
        )}>
          <CheckCircle2 className={cn("h-4 w-4", config.accent)} />
          <span className={cn("text-xs font-bold uppercase tracking-widest", config.accent)}>
            {config.label}
          </span>
        </div>

        {/* Member Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <UserCheck className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Registered Member</p>
              <p className="text-white font-mono text-sm truncate">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Verification ID</p>
              <p className="text-white font-mono text-sm truncate">{verificationId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Valid Until</p>
              <p className="text-white font-mono text-sm">
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
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">AES-256 Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                Issued {verifiedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute -bottom-8 -right-8 opacity-[0.03] pointer-events-none">
        <Fingerprint className="h-48 w-48" />
      </div>
    </motion.div>
  );
}
