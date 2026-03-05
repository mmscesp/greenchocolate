'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { StatsCard } from '@/components/admin/StatsCard';
import { BarChart3, 
Users, 
TrendingUp, 
Calendar,
Eye,
UserPlus,
Star,
MapPin,
ArrowUpRight,
ArrowDownRight,
Clock } from '@/lib/icons';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const stats = {
    totalViews: 1247,
    newMembers: 23,
    averageRating: 4.8,
    totalRequests: 45
  };

  const monthlyData = [
    { monthKey: 'club_panel.analytics.months.jan', views: 890, requests: 12 },
    { monthKey: 'club_panel.analytics.months.feb', views: 1020, requests: 15 },
    { monthKey: 'club_panel.analytics.months.mar', views: 1150, requests: 18 },
    { monthKey: 'club_panel.analytics.months.apr', views: 1247, requests: 23 },
  ];

  const topSources = [
    { sourceKey: 'club_panel.analytics.sources.direct_search', percentage: 45, visits: 561 },
    { sourceKey: 'club_panel.analytics.sources.social_media', percentage: 28, visits: 349 },
    { sourceKey: 'club_panel.analytics.sources.referrals', percentage: 18, visits: 224 },
    { sourceKey: 'club_panel.analytics.sources.other', percentage: 9, visits: 113 }
  ];

  const recentActivity = [
    { type: 'view', messageKey: 'club_panel.analytics.activity.new_profile_visit', timeKey: 'club_panel.analytics.activity_time.2m' },
    { type: 'request', messageKey: 'club_panel.analytics.activity.new_membership_request', timeKey: 'club_panel.analytics.activity_time.15m' },
    { type: 'view', messageKey: 'club_panel.analytics.activity.profile_viewed_downtown', timeKey: 'club_panel.analytics.activity_time.1h' },
    { type: 'request', messageKey: 'club_panel.analytics.activity.request_approved', timeKey: 'club_panel.analytics.activity_time.2h' },
    { type: 'view', messageKey: 'club_panel.analytics.activity.new_profile_visit', timeKey: 'club_panel.analytics.activity_time.3h' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('club_panel.analytics.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('club_panel.analytics.subtitle')}
          </p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-background"
        >
          <option value="7d">{t('club_panel.analytics.time_range.7d')}</option>
          <option value="30d">{t('club_panel.analytics.time_range.30d')}</option>
          <option value="90d">{t('club_panel.analytics.time_range.90d')}</option>
          <option value="1y">{t('club_panel.analytics.time_range.1y')}</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('club_panel.analytics.stats.profile_views')}
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          color="blue"
          trend={t('club_panel.analytics.stats.profile_views_trend')}
        />
        <StatsCard
          title={t('club_panel.analytics.stats.new_members')}
          value={stats.newMembers}
          icon={UserPlus}
          color="green"
          trend={t('club_panel.analytics.stats.new_members_trend')}
        />
        <StatsCard
          title={t('club_panel.analytics.stats.average_rating')}
          value={stats.averageRating}
          icon={Star}
          color="orange"
          trend={t('club_panel.analytics.stats.average_rating_trend')}
        />
        <StatsCard
          title={t('club_panel.analytics.stats.total_requests')}
          value={stats.totalRequests}
          icon={Users}
          color="purple"
          trend={t('club_panel.analytics.stats.total_requests_trend')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              {t('club_panel.analytics.monthly_trends.title')}
            </CardTitle>
            <CardDescription>{t('club_panel.analytics.monthly_trends.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.monthKey} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-10">{t(data.monthKey)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.views / 1300) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{data.views}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {data.requests} {t('club_panel.analytics.monthly_trends.requests_suffix')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              {t('club_panel.analytics.traffic_sources.title')}
            </CardTitle>
            <CardDescription>{t('club_panel.analytics.traffic_sources.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSources.map((source) => (
                <div key={source.sourceKey} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t(source.sourceKey)}</span>
                    <span className="text-muted-foreground">{source.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          source.percentage > 40 ? "bg-green-500" :
                          source.percentage > 25 ? "bg-blue-500" :
                          source.percentage > 15 ? "bg-brand" : "bg-muted-foreground"
                        )}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">
                      {source.visits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('club_panel.analytics.recent_activity.title')}</CardTitle>
            <CardDescription>{t('club_panel.analytics.recent_activity.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "p-2 rounded-full shrink-0",
                    activity.type === 'view' 
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                      : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  )}>
                    {activity.type === 'view' ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t(activity.messageKey)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {t(activity.timeKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>{t('club_panel.analytics.insights.title')}</CardTitle>
            <CardDescription>{t('club_panel.analytics.insights.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/20">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full shrink-0">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">{t('club_panel.analytics.insights.positive_growth.title')}</h4>
                    <p className="text-sm text-green-700 dark:text-green-500">
                      {t('club_panel.analytics.insights.positive_growth.body')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/20">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full shrink-0">
                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">{t('club_panel.analytics.insights.high_visibility.title')}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-500">
                      {t('club_panel.analytics.insights.high_visibility.body')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand/10 dark:bg-brand/15 rounded-lg border border-brand/20 dark:border-brand/30">
                <div className="flex items-start gap-3">
                  <div className="bg-brand/15 dark:bg-brand/20 p-2 rounded-full shrink-0">
                    <Star className="h-4 w-4 text-brand dark:text-brand-light" />
                  </div>
                  <div>
                    <h4 className="font-medium text-brand dark:text-brand-light mb-1">{t('club_panel.analytics.insights.excellent_rating.title')}</h4>
                    <p className="text-sm text-brand/90 dark:text-brand/90">
                      {t('club_panel.analytics.insights.excellent_rating.body')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
