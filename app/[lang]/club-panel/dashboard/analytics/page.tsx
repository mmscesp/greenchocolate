'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { StatsCard } from '@/components/admin/StatsCard';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  UserPlus,
  Star,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
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
    { month: 'Jan', views: 890, requests: 12 },
    { month: 'Feb', views: 1020, requests: 15 },
    { month: 'Mar', views: 1150, requests: 18 },
    { month: 'Apr', views: 1247, requests: 23 },
  ];

  const topSources = [
    { source: 'Direct Search', percentage: 45, visits: 561 },
    { source: 'Social Media', percentage: 28, visits: 349 },
    { source: 'Referrals', percentage: 18, visits: 224 },
    { source: 'Other', percentage: 9, visits: 113 }
  ];

  const recentActivity = [
    { type: 'view', message: 'New profile visit', time: '2 min ago' },
    { type: 'request', message: 'New membership request', time: '15 min ago' },
    { type: 'view', message: 'Profile viewed from downtown', time: '1 hour ago' },
    { type: 'request', message: 'Request approved', time: '2 hours ago' },
    { type: 'view', message: 'New profile visit', time: '3 hours ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your club's performance and member engagement
          </p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-background"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Profile Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          color="blue"
          trend="+12% vs last month"
        />
        <StatsCard
          title="New Members"
          value={stats.newMembers}
          icon={UserPlus}
          color="green"
          trend="+28% vs last month"
        />
        <StatsCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          color="orange"
          trend="Based on 142 reviews"
        />
        <StatsCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={Users}
          color="purple"
          trend="5 pending"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Monthly Trends
            </CardTitle>
            <CardDescription>Profile views and membership requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-10">{data.month}</span>
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
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {data.requests} req
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
              Traffic Sources
            </CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-muted-foreground">{source.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          source.percentage > 40 ? "bg-green-500" :
                          source.percentage > 25 ? "bg-blue-500" :
                          source.percentage > 15 ? "bg-orange-500" : "bg-muted-foreground"
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interactions with your club</CardDescription>
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
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {activity.time}
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
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key takeaways from your analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/20">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full shrink-0">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">Positive Growth</h4>
                    <p className="text-sm text-green-700 dark:text-green-500">
                      Your club has experienced 28% growth in new members this month. 
                      Great work maintaining service quality!
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
                    <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">High Visibility</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-500">
                      Your profile is getting many views. Consider updating photos and 
                      description to keep visitors engaged.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-900/20">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full shrink-0">
                    <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-400 mb-1">Excellent Rating</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-500">
                      With a 4.8/5 rating, your club is among the top-rated in the area. 
                      Keep up the great work!
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
