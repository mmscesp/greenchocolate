'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import {
  getUserNotifications,
  markNotificationsAsRead,
  type NotificationItem,
} from '@/app/actions/notifications';
import { Bell,
Check,
CheckCheck,
ExternalLink,
Loader2,
RefreshCw, } from '@/lib/icons';

function notificationTypeLabel(type: string): string {
  return type
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProfileNotificationsPage() {
  const { language, t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadIds = useMemo(() => notifications.filter((n) => !n.isRead).map((n) => n.id), [notifications]);

  const markOneAsRead = async (id: string) => {
    setMarkingId(id);
    try {
      await markNotificationsAsRead([id]);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (unreadIds.length === 0) return;
    setMarkingId('__all__');
    try {
      await markNotificationsAsRead(unreadIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('notifications.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('notifications.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button variant="outline" onClick={loadNotifications} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('notifications.refresh')}
          </Button>
          <Button onClick={markAllAsRead} disabled={markingId === '__all__' || unreadIds.length === 0}>
            {markingId === '__all__' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4 mr-2" />
            )}
            {t('notifications.mark_all_read')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">{t('notifications.stats.total')}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">{t('notifications.stats.unread')}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{unreadIds.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">{t('notifications.stats.read')}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{notifications.length - unreadIds.length}</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-6">
              <Bell className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('notifications.empty.title')}</h3>
            <p className="text-gray-600 mb-6">{t('notifications.empty.description')}</p>
            <Link href={`/${language}/profile/requests`}>
              <Button>{t('notifications.empty.open_requests')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Card key={item.id} className={item.isRead ? 'opacity-80' : ''}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <Badge variant={item.isRead ? 'outline' : 'secondary'}>
                      {item.isRead ? t('notifications.stats.read') : t('notifications.stats.unread')}
                    </Badge>
                    <Badge variant="outline">{notificationTypeLabel(item.type)}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.createdAt).toLocaleString('en-GB')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/${language}/profile/requests`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('notifications.open_requests')}
                    </Button>
                  </Link>
                  {!item.isRead && (
                    <Button
                      size="sm"
                      onClick={() => markOneAsRead(item.id)}
                      disabled={markingId === item.id}
                    >
                      {markingId === item.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {t('notifications.mark_read')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
