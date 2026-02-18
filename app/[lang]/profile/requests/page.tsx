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
import {
  Check,
  X,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';

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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.requests')}</h1>
          <p className="text-gray-600 mt-2">{t('requests.subtitle')}</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-gray-600">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.requests')}</h1>
          <p className="text-gray-600 mt-2">{t('requests.subtitle')}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">{error}</h3>
          <Button onClick={loadRequests} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.requests')}</h1>
          <p className="text-gray-600 mt-2">{t('requests.subtitle')}</p>
        </div>
        <Button variant="outline" onClick={loadRequests} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('requests.total')}</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('requests.pending')}</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('requests.approved')}</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('requests.rejected')}</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {backendStatus && (
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Application Stage</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {backendStatus.application.status.replaceAll('_', ' ')}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              Passport: <span className="font-medium text-gray-900">{backendStatus.passport.verificationId}</span>
            </div>
            {backendStatus.application.estimatedCompletion && (
              <div className="text-sm text-gray-600">
                Est. completion: {new Date(backendStatus.application.estimatedCompletion).toLocaleDateString('es-ES')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-6">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('requests.empty_title')}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{t('requests.empty_description')}</p>
            <Link href={`/${language}/clubs`}>
              <Button variant="cannabis">{t('requests.explore_clubs')}</Button>
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
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Club Image */}
                  <Avatar className="w-full md:w-32 h-24 rounded-lg">
                    <AvatarImage src={request.clubImage || undefined} alt={request.clubName} className="object-cover" />
                    <AvatarFallback className="rounded-lg">
                      <MapPin className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.clubName}</h3>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.clubNeighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>

                    {request.message && (
                      <p className="text-sm text-gray-600 line-clamp-2 italic">
                        &ldquo;{request.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link href={`/${language}/clubs/${request.clubSlug}`}>
                      <Button variant="outline" size="sm">
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
