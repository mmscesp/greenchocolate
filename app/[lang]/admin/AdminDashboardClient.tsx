'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, 
Building2, 
Shield, 
ClipboardList,
ArrowUpRight,
ArrowDownRight,
Clock,
CheckCircle2,
XCircle,
AlertTriangle,
TrendingUp } from '@/lib/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardData {
  totalUsers: number;
  totalClubs: number;
  pendingVerifications: number;
  pendingRequests: number;
  recentUsers: Array<{
    id: string;
    email: string;
    displayName: string | null;
    role: string;
    createdAt: Date;
    avatarUrl: string | null;
  }>;
  recentRequests: Array<{
    id: string;
    status: string;
    createdAt: Date;
    user: {
      displayName: string | null;
      email: string;
      avatarUrl: string | null;
    };
    club: {
      name: string;
      slug: string;
    };
  }>;
  clubStatsByCity: Array<{
    cityName: string;
    count: number;
  }>;
  userRoleDistribution: Array<{
    role: string;
    count: number;
  }>;
}

interface AdminDashboardClientProps {
  lang: string;
  data: DashboardData;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'CLUB_ADMIN':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'REJECTED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

export function AdminDashboardClient({ lang, data }: AdminDashboardClientProps) {
  const adminCount = data.userRoleDistribution.find(r => r.role === 'ADMIN')?.count || 0;
  const clubAdminCount = data.userRoleDistribution.find(r => r.role === 'CLUB_ADMIN')?.count || 0;
  const userCount = data.userRoleDistribution.find(r => r.role === 'USER')?.count || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Platform overview and key metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          color="blue"
          trend={`${userCount} members • ${clubAdminCount} club admins`}
        />
        <StatsCard
          title="Total Clubs"
          value={data.totalClubs.toLocaleString()}
          icon={Building2}
          color="green"
          trend={`${data.pendingVerifications} pending verification`}
        />
        <StatsCard
          title="Pending Requests"
          value={data.pendingRequests.toLocaleString()}
          icon={ClipboardList}
          color="orange"
        />
        <StatsCard
          title="Platform Admins"
          value={adminCount.toString()}
          icon={Shield}
          color="purple"
        />
      </div>

      {/* Alert Banner for Pending Items */}
      {(data.pendingVerifications > 0 || data.pendingRequests > 10) && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Attention Required</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  {data.pendingVerifications > 0 && `${data.pendingVerifications} club(s) awaiting verification. `}
                  {data.pendingRequests > 10 && `${data.pendingRequests} membership requests pending review.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Users</span>
              <Link
                href={`/${lang}/admin/users`}
                className="text-sm font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                View all
              </Link>
            </CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl || ''} />
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {user.displayName || 'Anonymous'}
                      </span>
                      <Badge className={cn('text-xs', getRoleBadgeVariant(user.role))}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Requests</span>
              <Link
                href={`/${lang}/admin/requests`}
                className="text-sm font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                View all
              </Link>
            </CardTitle>
            <CardDescription>Latest membership requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.user.avatarUrl || ''} />
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {request.user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {request.user.displayName || 'Anonymous'}
                      </span>
                      {getStatusIcon(request.status)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      → {request.club.name}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clubs by City */}
        <Card>
          <CardHeader>
            <CardTitle>Clubs by City</CardTitle>
            <CardDescription>Distribution of clubs across cities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.clubStatsByCity.map((city, index) => {
                const maxCount = data.clubStatsByCity[0]?.count || 1;
                const percentage = (city.count / maxCount) * 100;
                
                return (
                  <div key={city.cityName} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{city.cityName}</span>
                      <span className="text-slate-500 dark:text-slate-400">{city.count} clubs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            index === 0 ? "bg-green-500" :
                            index === 1 ? "bg-blue-500" :
                            index === 2 ? "bg-purple-500" :
                            "bg-slate-400"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Breakdown of user types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.userRoleDistribution.map((role) => {
                const percentage = (role.count / data.totalUsers) * 100;
                
                return (
                  <div key={role.role} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-xs', getRoleBadgeVariant(role.role))}>
                          {role.role.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400">
                        {role.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            role.role === 'ADMIN' ? "bg-red-500" :
                            role.role === 'CLUB_ADMIN' ? "bg-blue-500" :
                            "bg-slate-400"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
