import React from 'react';
import { Club } from '@/lib/types';
import GatedContent from '@/components/clubs/GatedContent';
import { MapPin, Phone, Mail, Globe } from '@/lib/icons';

interface Props {
  club: Club;
  isVerified: boolean;
}

export default function ClubContactSection({ club, isVerified }: Props) {
  if (!isVerified) {
    return (
      <GatedContent 
        label="Forensic Access Required" 
        description="Legal contact details and exact coordinates are restricted to verified members only."
      />
    );
  }

  return (
    <div className="bg-midnight-charcoal/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 hover:border-primary/30 transition-all duration-500">
      <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        Contact Information
      </h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0 border border-emerald-500/20">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Address</span>
            <span className="text-sm text-white font-medium">{club.address}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0 border border-emerald-500/20">
            <Phone className="h-5 w-5 text-primary" />
          </div>
           <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</span>
            <span className="text-sm text-white font-medium">{club.phoneNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0 border border-emerald-500/20">
            <Mail className="h-5 w-5 text-primary" />
          </div>
           <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</span>
            <span className="text-sm text-white font-medium">{club.contactEmail}</span>
          </div>
        </div>

        {club.website && (
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0 border border-emerald-500/20">
              <Globe className="h-5 w-5 text-primary" />
            </div>
             <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Website</span>
              <a href={`https://${club.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                {club.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
