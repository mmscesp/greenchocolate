import React from 'react';
import { Club } from '@/lib/types';
import GatedContent from '@/components/clubs/GatedContent';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

interface Props {
  club: Club;
  isVerified: boolean;
}

export default function ClubContactSection({ club, isVerified }: Props) {
  if (!isVerified) {
    return <GatedContent label="Contact Details Locked" />;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 hover:border-green-500/30 transition-colors duration-500">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
          <Mail className="h-4 w-4 text-green-400" />
        </div>
        Contact Information
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
            <MapPin className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <span className="block text-sm font-medium text-zinc-300">Address</span>
            <span className="text-sm text-zinc-400">{club.address}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
            <Phone className="h-5 w-5 text-green-400" />
          </div>
           <div>
            <span className="block text-sm font-medium text-zinc-300">Phone</span>
            <span className="text-sm text-zinc-400">{club.phoneNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
            <Mail className="h-5 w-5 text-green-400" />
          </div>
           <div>
            <span className="block text-sm font-medium text-zinc-300">Email</span>
            <span className="text-sm text-zinc-400">{club.contactEmail}</span>
          </div>
        </div>

        {club.website && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
              <Globe className="h-5 w-5 text-green-400" />
            </div>
             <div>
              <span className="block text-sm font-medium text-zinc-300">Website</span>
              <a href={`https://${club.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                {club.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
