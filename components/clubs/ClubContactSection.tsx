'use client';

import React from 'react';
import { Club } from '@/lib/types';
import GatedContent from '@/components/clubs/GatedContent';
import { MapPin, Phone, Mail, Globe } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  club: Club;
  isVerified: boolean;
}

export default function ClubContactSection({ club, isVerified }: Props) {
  const { t } = useLanguage();

  if (!isVerified) {
    return (
      <GatedContent 
        label={t('clubs.contact.gated_label')} 
        description={t('clubs.contact.gated_description')}
      />
    );
  }

  return (
    <div className="bg-[#0A0A0A] backdrop-blur-md rounded-[2rem] border border-white/5 p-8 hover:border-[#E8A838]/20 transition-all duration-500 shadow-2xl">
      <h3 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#E8A838]/10 rounded-xl flex items-center justify-center border border-[#E8A838]/20">
          <Mail className="h-5 w-5 text-[#E8A838]" />
        </div>
        {t('clubs.contact.title')}
      </h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-white/5 rounded-xl shrink-0 border border-white/5">
            <MapPin className="h-5 w-5 text-[#E8A838]" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('clubs.contact.address')}</span>
            <span className="text-sm text-zinc-300 font-medium font-serif italic">{club.address}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white/5 rounded-xl shrink-0 border border-white/5">
            <Phone className="h-5 w-5 text-[#E8A838]" />
          </div>
           <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('clubs.contact.phone')}</span>
            <span className="text-sm text-zinc-300 font-medium font-mono">{club.phoneNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white/5 rounded-xl shrink-0 border border-white/5">
            <Mail className="h-5 w-5 text-[#E8A838]" />
          </div>
           <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('clubs.contact.email')}</span>
            <span className="text-sm text-zinc-300 font-medium font-mono">{club.contactEmail}</span>
          </div>
        </div>

        {club.website && (
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl shrink-0 border border-white/5">
              <Globe className="h-5 w-5 text-[#E8A838]" />
            </div>
             <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('clubs.contact.website')}</span>
              <a href={`https://${club.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#E8A838] hover:text-[#d4962e] transition-colors font-bold underline decoration-[#E8A838]/20 underline-offset-4">
                {club.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
