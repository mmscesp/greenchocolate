import React from 'react';
import { Club } from '@/lib/types';
import GatedContent from '@/components/clubs/GatedContent';
import { Badge } from '@/components/ui/badge';
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
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <span className="block text-sm font-medium text-gray-900">Address</span>
            <span className="text-sm text-gray-600">{club.address}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-green-600 shrink-0" />
           <div>
            <span className="block text-sm font-medium text-gray-900">Phone</span>
            <span className="text-sm text-gray-600">{club.phoneNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-green-600 shrink-0" />
           <div>
            <span className="block text-sm font-medium text-gray-900">Email</span>
            <span className="text-sm text-gray-600">{club.contactEmail}</span>
          </div>
        </div>

        {club.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-green-600 shrink-0" />
             <div>
              <span className="block text-sm font-medium text-gray-900">Website</span>
              <a href={`https://${club.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                {club.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
