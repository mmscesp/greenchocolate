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
  const formatText = (key: string, values: Record<string, string | number>) => {
    let message = t(key);

    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{{${name}}}`, String(value));
    }

    return message;
  };

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
    : (club.neighborhood || t('club_dashboard.fallback.location_pending'));

  const displayClub = {
    name: club.name,
    location,
    members: club.capacity || 0,
    capacity: club.capacity || 100,
    description: club.description || club.shortDescription || t('club_dashboard.fallback.no_description'),
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
          title={t('club_dashboard.stats.total_members')} 
          value={displayClub.members} 
          icon={Users} 
          color="green" 
          trend={t('club_dashboard.stats.total_members_trend')}
        />
        <StatsCard 
          title={t('club_dashboard.stats.pending_requests')} 
          value={pendingRequests} 
          icon={FileText} 
          color="blue" 
          trend={t('club_dashboard.stats.pending_requests_trend')}
        />
        <StatsCard 
          title={t('club_dashboard.stats.upcoming_events')} 
          value="0" 
          icon={Calendar} 
          color="orange" 
        />
        <StatsCard 
          title={t('club_dashboard.stats.capacity_used')} 
          value={`${displayClub.capacity > 0 ? ((displayClub.members / displayClub.capacity) * 100).toFixed(0) : 0}%`} 
          icon={TrendingUp} 
          color="purple" 
          trend={t('club_dashboard.stats.capacity_used_trend')}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Club Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('club_dashboard.info.title')}</CardTitle>
            <CardDescription>{t('club_dashboard.info.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">{t('club_dashboard.info.fields.description')}</span>
                <p className="text-sm text-muted-foreground line-clamp-3">{displayClub.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">{t('club_dashboard.info.fields.founded')}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{displayClub.foundedYear}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">{t('club_dashboard.info.fields.capacity')}</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{formatText('club_dashboard.info.capacity_value', { count: displayClub.capacity })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/club-panel/dashboard/profile">
                <Button className="w-full" variant="outline">{t('club_dashboard.actions.edit_profile')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('club_dashboard.actions.title')}</CardTitle>
            <CardDescription>{t('club_dashboard.actions.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/club-panel/dashboard/profile" className="block">
              <Button variant="secondary" className="w-full justify-start h-auto py-4 px-6">
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">{t('club_dashboard.actions.update_details')}</span>
                  <span className="text-xs text-muted-foreground font-normal">{t('club_dashboard.actions.update_details_desc')}</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/club-panel/dashboard/requests" className="block">
              <Button variant="secondary" className="w-full justify-start h-auto py-4 px-6 relative overflow-hidden">
                <div className="flex flex-col items-start text-left z-10">
                  <span className="font-semibold">{t('club_dashboard.actions.review_requests')}</span>
                  <span className="text-xs text-muted-foreground font-normal">{formatText('club_dashboard.actions.awaiting_review', { count: pendingRequests })}</span>
                </div>
                {pendingRequests > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                    {formatText('club_dashboard.actions.new_badge', { count: pendingRequests })}
                  </div>
                )}
              </Button>
            </Link>
            
            <Link href="/club-panel/dashboard/events" className="block">
              <Button variant="secondary" className="w-full justify-start h-auto py-4 px-6">
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">{t('club_dashboard.actions.create_event')}</span>
                  <span className="text-xs text-muted-foreground font-normal">{t('club_dashboard.actions.create_event_desc')}</span>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
