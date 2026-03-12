'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, 
Building2, 
Shield, 
ClipboardList,
CalendarDays,
Clock,
CheckCircle2,
XCircle,
AlertTriangle,
Activity } from '@/lib/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

interface DashboardData {
  totalUsers: number;
  totalClubs: number;
  verifiedClubs: number;
  activeClubs: number;
  pendingVerifications: number;
  pendingRequests: number;
  publishedEvents: number;
  activeSafetyPasses: number;
  expiringSafetyPasses: number;
  pendingBookings: number;
  upcomingBookings: number;
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
  recentAuditEvents: Array<{
    id: string;
    tableName: string;
    operation: string;
    changedBy: string;
    actorLabel: string;
    createdAt: Date;
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
      return <Clock className="h-4 w-4 text-brand" />;
  }
};

const getRoleLabel = (role: string, t: (key: string) => string) => {
  switch (role) {
    case 'ADMIN':
      return t('admin.users.roles.admin');
    case 'CLUB_ADMIN':
      return t('admin.users.roles.club_admin');
    case 'USER':
      return t('admin.users.roles.user');
    default:
      return t('admin.common.unknown');
  }
};

export function AdminDashboardClient({ lang, data }: AdminDashboardClientProps) {
  const { t } = useLanguage();
  const formatText = (key: string, values: Record<string, string | number>) => {
    let message = t(key);

    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{{${name}}}`, String(value));
    }

    return message;
  };

  const adminCount = data.userRoleDistribution.find(r => r.role === 'ADMIN')?.count || 0;
  const clubAdminCount = data.userRoleDistribution.find(r => r.role === 'CLUB_ADMIN')?.count || 0;
  const userCount = data.userRoleDistribution.find(r => r.role === 'USER')?.count || 0;
  const attentionItems = [
    data.pendingVerifications > 0 ? formatText('admin.dashboard.alert.pending_verifications', {
      count: data.pendingVerifications,
    }) : null,
    data.pendingRequests > 0 ? formatText('admin.dashboard.alert.pending_requests', {
      count: data.pendingRequests,
    }) : null,
    data.expiringSafetyPasses > 0 ? `${data.expiringSafetyPasses} safety passes expire within 14 days.` : null,
    data.pendingBookings > 0 ? `${data.pendingBookings} bookings are still pending confirmation.` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('admin.dashboard.header.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t('admin.dashboard.header.description')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('admin.dashboard.metrics.total_users')}
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          color="blue"
          trend={formatText('admin.dashboard.metrics.total_users_trend', {
            members: userCount,
            clubAdmins: clubAdminCount,
          })}
        />
        <StatsCard
          title="Verified clubs"
          value={`${data.verifiedClubs}/${data.totalClubs}`}
          icon={Building2}
          color="green"
          trend={`${data.pendingVerifications} awaiting verification`}
        />
        <StatsCard
          title="Active safety passes"
          value={data.activeSafetyPasses.toLocaleString()}
          icon={Shield}
          color="orange"
          trend={
            data.expiringSafetyPasses > 0
              ? `${data.expiringSafetyPasses} expiring in 14 days`
              : 'No immediate expirations'
          }
        />
        <StatsCard
          title="Pending membership requests"
          value={data.pendingRequests.toLocaleString()}
          icon={ClipboardList}
          color="purple"
          trend={`${data.pendingBookings} bookings also need review`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Pending club verifications"
          value={data.pendingVerifications.toLocaleString()}
          icon={Building2}
          color="default"
          trend={`${data.activeClubs} clubs currently active`}
        />
        <StatsCard
          title="Upcoming bookings"
          value={data.upcomingBookings.toLocaleString()}
          icon={CalendarDays}
          color="blue"
          trend={`${data.pendingBookings} still pending`}
        />
        <StatsCard
          title="Published events"
          value={data.publishedEvents.toLocaleString()}
          icon={CalendarDays}
          color="green"
          trend="Live across the public surface"
        />
        <StatsCard
          title="Platform admins"
          value={adminCount.toString()}
          icon={Activity}
          color="purple"
          trend="Protect the last-admin path"
        />
      </div>

      {/* Alert Banner for Pending Items */}
      {attentionItems.length > 0 && (
        <Card className="border-brand/30 bg-brand/10 dark:bg-brand/15 dark:border-brand/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-brand dark:text-brand-light mt-0.5" />
              <div>
                <h3 className="font-medium text-brand dark:text-brand-light">{t('admin.dashboard.alert.title')}</h3>
                <div className="mt-2 space-y-1 text-sm text-brand/90 dark:text-brand/90">
                  {attentionItems.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
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
                    <span>{t('admin.dashboard.recent_users.title')}</span>
              <Link
                href={`/${lang}/admin/users`}
                className="text-sm font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                  {t('common.view_all')}
              </Link>
            </CardTitle>
            <CardDescription>{t('admin.dashboard.recent_users.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentUsers.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No users have been created yet.</p>
            ) : (
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
                          {user.displayName || t('admin.common.anonymous')}
                        </span>
                        <Badge className={cn('text-xs', getRoleBadgeVariant(user.role))}>
                          {getRoleLabel(user.role, t)}
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
            )}
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('admin.dashboard.recent_requests.title')}</span>
              <Link
                href={`/${lang}/admin/requests`}
                className="text-sm font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {t('common.view_all')}
              </Link>
            </CardTitle>
            <CardDescription>{t('admin.dashboard.recent_requests.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No membership requests have been submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {data.recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.user.avatarUrl || ''} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {request.user.displayName?.charAt(0) || t('admin.common.user_initial')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {request.user.displayName || t('admin.common.anonymous')}
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
            )}
          </CardContent>
        </Card>

        {/* Clubs by City */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.city_distribution.title')}</CardTitle>
            <CardDescription>{t('admin.dashboard.city_distribution.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {data.clubStatsByCity.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No club distribution data is available yet.</p>
            ) : (
              <div className="space-y-4">
                {data.clubStatsByCity.map((city, index) => {
                  const maxCount = data.clubStatsByCity[0]?.count || 1;
                  const percentage = (city.count / maxCount) * 100;
                  
                  return (
                    <div key={city.cityName} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{city.cityName}</span>
                        <span className="text-slate-500 dark:text-slate-400">{city.count} {t('admin.dashboard.city_distribution.clubs_suffix')}</span>
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
            )}
          </CardContent>
        </Card>

        {/* User Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.role_distribution.title')}</CardTitle>
            <CardDescription>{t('admin.dashboard.role_distribution.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {data.userRoleDistribution.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No user role data is available yet.</p>
            ) : (
              <div className="space-y-4">
                {data.userRoleDistribution.map((role) => {
                  const percentage = (role.count / data.totalUsers) * 100;
                  
                  return (
                    <div key={role.role} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs', getRoleBadgeVariant(role.role))}>
                            {getRoleLabel(role.role, t)}
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent admin activity</CardTitle>
            <CardDescription>Latest audited changes across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentAuditEvents.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No recent admin audit activity recorded.</p>
            ) : (
              <div className="space-y-3">
                {data.recentAuditEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{event.operation}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{event.tableName}</p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Actor: {event.actorLabel}
                      {event.actorLabel !== event.changedBy ? (
                        <span className="hidden md:inline"> ({event.changedBy})</span>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
