'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  getClubMembershipRequests,
  approveMembershipRequest,
  rejectMembershipRequest,
  ActionState,
} from '@/app/actions/membership';
import { toast } from 'sonner';
import {
  Check,
  X,
  Clock,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  User,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface ClubRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export default function ClubRequestsPage() {
  const [requests, setRequests] = useState<ClubRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClubRequest | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Get actual club ID from user's profile/context
  
  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Calling without arguments will infer the club from the user's managed club
      const data = await getClubMembershipRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load membership requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const result: ActionState = await approveMembershipRequest(
        selectedRequest.id,
        undefined, // clubSlug - will be inferred on server
        approvalNotes
      );
      if (result.success) {
        toast.success(result.message || 'Request approved');
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: 'APPROVED' } : r
          )
        );
        setIsApproveDialogOpen(false);
        setApprovalNotes('');
      } else {
        toast.error(result.message || 'Failed to approve request');
      }
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Failed to approve request');
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const result: ActionState = await rejectMembershipRequest(
        selectedRequest.id,
        undefined, // clubSlug - will be inferred on server
        rejectionReason
      );
      if (result.success) {
        toast.success(result.message || 'Request rejected');
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: 'REJECTED' } : r
          )
        );
        setIsRejectDialogOpen(false);
        setRejectionReason('');
      } else {
        toast.error(result.message || 'Failed to reject request');
      }
    } catch (err) {
      console.error('Reject error:', err);
      toast.error('Failed to reject request');
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    const matchesSearch =
      !searchQuery ||
      request.user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const approvedRequests = requests.filter((r) => r.status === 'APPROVED');
  const rejectedRequests = requests.filter((r) => r.status === 'REJECTED');

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Requests</h1>
          <p className="text-gray-600 mt-2">Manage membership requests for your club</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Requests</h1>
          <p className="text-gray-600 mt-2">Manage membership requests for your club</p>
        </div>
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">{error}</h3>
          <Button onClick={loadRequests} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership Requests</h1>
          <p className="text-gray-600 mt-2">Manage membership requests for your club</p>
        </div>
        <Button variant="outline" onClick={loadRequests} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{approvedRequests.length}</p>
          <p className="text-sm text-gray-600">Approved</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{rejectedRequests.length}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Requests</h2>
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No membership requests yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      {request.user.avatarUrl ? (
                        <img
                          src={request.user.avatarUrl}
                          alt={request.user.displayName || ''}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {request.user.displayName || 'Anonymous'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{request.user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 ml-13">
                    {getStatusBadge(request.status)}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(request.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  {request.message && (
                    <p className="text-sm text-gray-600 mt-2 ml-13 line-clamp-1 italic">
                      &ldquo;{request.message}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {request.status === 'PENDING' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsRejectDialogOpen(true);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsApproveDialogOpen(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </>
                  )}
                  {request.status !== 'PENDING' && (
                    <span className="text-sm text-gray-500">
                      {request.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Membership Request</DialogTitle>
            <DialogDescription>
              You are about to approve the membership request from{' '}
              {selectedRequest?.user.displayName || selectedRequest?.user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
              <Textarea
                placeholder="Add any notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Membership Request</DialogTitle>
            <DialogDescription>
              You are about to reject the membership request from{' '}
              {selectedRequest?.user.displayName || selectedRequest?.user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Reason (optional)</label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
