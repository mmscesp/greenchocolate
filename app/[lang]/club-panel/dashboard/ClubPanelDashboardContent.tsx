'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card } from '@/components/ui/card';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getClubMembershipRequests } from '@/app/actions/membership';
import type { ClubCard } from '@/app/actions/clubs';

interface ClubPanelDashboardContentProps {
  club: ClubCard | null;
}

export default function ClubPanelDashboardContent({ club }: ClubPanelDashboardContentProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      if (club?.slug) {
        const data = await getClubMembershipRequests(club.slug);
        setRequests(data);
      }
      setLoading(false);
    }
    fetchRequests();
  }, [club?.slug]);

  if (!club) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Club Found</h1>
        <p className="text-gray-600 mb-6">
          You don't have access to any club yet. Contact an administrator to get club access.
        </p>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{club.name}</h1>
        <p className="text-gray-600">{club.neighborhood}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Members" 
          value={club.capacity} 
          icon={Users} 
          color="green" 
        />
        <StatsCard 
          title="Pending Requests" 
          value={pendingRequests} 
          icon={FileText} 
          color="blue" 
        />
        <StatsCard 
          title="Capacity Used" 
          value={`${Math.floor(Math.random() * 80 + 20)}%`} 
          icon={TrendingUp} 
          color="purple" 
        />
        <StatsCard 
          title="Active Members" 
          value={Math.floor(club.capacity * 0.7)} 
          icon={Users} 
          color="orange" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Club Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-gray-900">{club.description || 'No description available'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Founded</p>
              <p className="text-gray-900">{club.foundedYear || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Capacity</p>
              <p className="text-gray-900">{club.capacity} members</p>
            </div>
            <Link href="/club-panel/dashboard/profile">
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Edit Profile</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/club-panel/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                Update Club Details
              </Button>
            </Link>
            <Link href="/club-panel/dashboard/requests">
              <Button variant="outline" className="w-full justify-start">
                Review {pendingRequests} Pending Requests
              </Button>
            </Link>
            <Link href="/club-panel/dashboard/events">
              <Button variant="outline" className="w-full justify-start">
                Manage Events
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
