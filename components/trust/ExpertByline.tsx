'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

interface ExpertBylineProps {
  name: string;
  role: string;
  avatar?: string;
  date?: string;
}

export default function ExpertByline({ name, role, avatar, date }: ExpertBylineProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 py-4 border-b border-white/10 mb-8">
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-white leading-none mb-1">
          {t('expert_byline.reviewed_by')} <span className="text-green-400">{name}</span>
        </p>
        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
          {role} {date && `• ${t('expert_byline.last_updated')} ${date}`}
        </p>
      </div>
    </div>
  );
}
