'use client';

import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Calendar, FileText, TrendingUp, MapPin, Clock } from '@/lib/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { ClubCard, ClubDetail } from '@/app/actions/clubs';
import { useEffect, useState } from 'react';
import { getClubMembershipRequests } from '@/app/actions/clubs';

interface ClubDashboardClientProps {
  club: ClubCard | ClubDetail | null;
}

interface MembershipRequest {
  id: string;
  status: string;
}

export function ClubDashboardClient({ club }: ClubDashboardClientProps) {
  const { t } = useLanguage();
  const [pendingRequests, setPendingRequests] = useState(0);
  
  useEffect(() => {
    async function fetchData() {
      if (club) {
        const requests = await getClubMembershipRequests(club.id);
        setPendingRequests(requests.filter((r: MembershipRequest) => r.status === 'PENDING').length);
      }
    }
    fetchData();
  }, [club]);

  // Show message if no club assigned
  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{t('club_dashboard.no_club')}</CardTitle>
            <CardDescription>
              {t('club_dashboard.no_club_description')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  // Use real club data
  const location = ('addressDisplay' in club && club.addressDisplay)
    ? club.addressDisplay
    : (club.neighborhood || 'Location Pending');

  const displayClub = {
    name: club.name,
    location,
    members: club.capacity || 0,
    capacity: club.capacity || 100,
    description: club.description || club.shortDescription || 'No description available.',
    foundedYear: club.foundedYear || new Date().getFullYear(),
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{displayClub.name}</h1>
        <div className="flex items-center text-muted-foreground gap-2">
          <MapPin className="h-4 w-4" />
          <span>{displayClub.location}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Members" 
          value={displayClub.members} 
          icon={Users} 
          color="green" 
          trend="+12% from last month"
        />
        <StatsCard 
          title="Pending Requests" 
          value={pendingRequests} 
          icon={FileText} 
          color="blue" 
          trend="Requires attention"
        />
        <StatsCard 
          title="Upcoming Events" 
          value="0" 
          icon={Calendar} 
          color="orange" 
        />
        <StatsCard 
          title="Capacity Used" 
          value={`${displayClub.capacity > 0 ? ((displayClub.members / displayClub.capacity) * 100).toFixed(0) : 0}%`} 
          icon={TrendingUp} 
          color="purple" 
          trend="Healthy level"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Club Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Club Information</CardTitle>
            <CardDescription>Details about your club visible to members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Description</span>
                <p className="text-sm text-muted-foreground line-clamp-3">{displayClub.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Founded</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{displayClub.foundedYear}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Capacity</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{displayClub.capacity} members</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/club-panel/dashboard/profile">
                <Button className="w-full" variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your club operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/club-panel/dashboard/profile" className="block">
              <Button variant="secondary" className="w-full justify-start h-auto py-4 px-6">
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Update Club Details</span>
                  <span className="text-xs text-muted-foreground font-normal">Change name, location, or description</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/club-panel/dashboard/requests" className="block">
              <Button variant="secondary" className="w-full justify-start h-auto py-4 px-6 relative overflow-hidden">
                <div className="flex flex-col items-start text-left z-10">
                  <span className="font-semibold">Review Membership Requests</span>
                  <span className="text-xs text-muted-foreground font-normal">{pendingRequests} awaiting review</span>
                </div>
                {pendingRequests > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                    {pendingRequests} New
                  </div>
                )}
              </Button>
            </Link>
            
            <Link href="/club-panel/dashboard/events" className="block">
              <Button variant="secondary" className="w-full justify-start h-auto py-4 px-6">
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Create Event</span>
                  <span className="text-xs text-muted-foreground font-normal">Schedule a new event for members</span>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
