'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import {
  getUserMembershipRequests,
  cancelMembershipRequest,
  MembershipRequestCard,
  ActionState,
} from '@/app/actions/membership';
import { getProfileBackendStatus, type UserProfileBackendStatus } from '@/app/actions/users';
import Link from 'next/link';
import { Check,
X,
Clock,
AlertCircle,
Calendar,
MapPin,
ExternalLink,
Loader2,
RefreshCw, } from '@/lib/icons';

export default function UserRequestsPage() {
  const { t, language } = useLanguage();
  const [requests, setRequests] = useState<MembershipRequestCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<UserProfileBackendStatus | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserMembershipRequests();
      setRequests(data);
      const status = await getProfileBackendStatus();
      setBackendStatus(status);
    } catch (err) {
      setError(t('requests.error_load'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCancel = async (requestId: string) => {
    if (!confirm(t('requests.confirm_cancel'))) return;

    setCancellingId(requestId);
    try {
      const result: ActionState = await cancelMembershipRequest(requestId);
      if (result.success) {
        // Remove the cancelled request from the list
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
      } else {
        alert(result.message || t('requests.error_cancel'));
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert(t('requests.error_cancel'));
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t('requests.status.pending')}
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            {t('requests.status.approved')}
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            {t('requests.status.rejected')}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboard.requests')}</h1>
          <p className="text-muted-foreground mt-1">{t('requests.subtitle')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboard.requests')}</h1>
          <p className="text-muted-foreground mt-1">{t('requests.subtitle')}</p>
        </div>
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center">
            <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-destructive mb-2">{error}</h3>
            <Button onClick={loadRequests} variant="secondary" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboard.requests')}</h1>
          <p className="text-muted-foreground mt-1">{t('requests.subtitle')}</p>
        </div>
        <Button variant="secondary" onClick={loadRequests} disabled={loading} className="self-start">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('requests.total')}</p>
              <p className="text-2xl font-bold text-foreground">{requests.length}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('requests.pending')}</p>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            </div>
            <div className="bg-brand/10 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('requests.approved')}</p>
              <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('requests.rejected')}</p>
              <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-xl">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {backendStatus && (
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('requests.current_stage')}</p>
              <p className="text-xl font-semibold text-foreground mt-1 capitalize">
                {backendStatus.application.status.replaceAll('_', ' ')}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {t('requests.passport')}: <span className="font-medium text-foreground font-mono">{backendStatus.passport.verificationId}</span>
            </div>
            {backendStatus.application.estimatedCompletion && (
              <div className="text-sm text-muted-foreground">
                {t('requests.estimated_completion')}: <span className="font-medium text-foreground">{new Date(backendStatus.application.estimatedCompletion).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="text-center py-16 shadow-sm">
          <CardContent>
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('requests.empty_title')}</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t('requests.empty_description')}</p>
            <Link href={`/${language}/clubs`}>
              <Button>{t('requests.explore_clubs')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Club Image */}
                  <Avatar className="w-full md:w-28 h-24 rounded-xl border">
                    <AvatarImage src={request.clubImage || undefined} alt={request.clubName} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-muted">
                      <MapPin className="h-8 w-8 text-muted-foreground/50" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{request.clubName}</h3>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span>{request.clubNeighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {request.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic bg-muted/50 p-2 rounded-lg">
                        {'"'}{request.message}{'"'}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/${language}/clubs/${request.clubSlug}`}>
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('common.view')}
                      </Button>
                    </Link>

                    {request.status === 'PENDING' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(request.id)}
                        disabled={cancellingId === request.id}
                      >
                        {cancellingId === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        {t('common.cancel')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
