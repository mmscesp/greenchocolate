'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  advanceApplicationStage,
  getClubApplications,
  rejectApplication,
  type ClubApplicationItem,
  type ApplicationStage,
} from '@/app/actions/applications';
import { toast } from 'sonner';
import { Check,
X,
Clock,
Search,
Filter,
Loader2,
RefreshCw,
User,
Mail,
Calendar,
AlertCircle, } from '@/lib/icons';
import { cn } from '@/lib/utils';

export default function ClubRequestsPage() {
  const [requests, setRequests] = useState<ClubApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ClubApplicationItem | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClubApplications();
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
      const nextStage: ApplicationStage = selectedRequest.status === 'BACKGROUND_CHECK'
        ? 'FINAL_APPROVAL'
        : 'BACKGROUND_CHECK';

      const result = await advanceApplicationStage(selectedRequest.id, nextStage, approvalNotes);
      if (result.success) {
        toast.success(nextStage === 'FINAL_APPROVAL' ? 'Application approved' : 'Application moved to background check');
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id
              ? {
                  ...r,
                  stage: nextStage,
                  status: nextStage === 'FINAL_APPROVAL' ? 'APPROVED' : 'BACKGROUND_CHECK',
                }
              : r
          )
        );
        setIsApproveDialogOpen(false);
        setApprovalNotes('');
      } else {
        toast.error(result.error || 'Failed to advance application stage');
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
      const result = await rejectApplication(selectedRequest.id, rejectionReason || 'Rejected by club admin');
      if (result.success) {
        toast.success('Application rejected');
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: 'REJECTED' } : r
          )
        );
        setIsRejectDialogOpen(false);
        setRejectionReason('');
      } else {
        toast.error(result.error || 'Failed to reject request');
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
      case 'UNDER_REVIEW':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case 'BACKGROUND_CHECK':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Background Check
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 flex items-center gap-1">
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

  const pendingRequests = requests.filter((r) => r.status === 'UNDER_REVIEW');
  const approvedRequests = requests.filter((r) => r.status === 'APPROVED');
  const rejectedRequests = requests.filter((r) => r.status === 'REJECTED');

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Requests</h1>
          <p className="text-muted-foreground mt-2">Manage membership requests for your club</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Requests</h1>
          <p className="text-muted-foreground mt-2">Manage membership requests for your club</p>
        </div>
        <Card className="p-12 text-center border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium text-destructive mb-2">{error}</h3>
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
          <h1 className="text-3xl font-bold tracking-tight">Membership Requests</h1>
          <p className="text-muted-foreground mt-2">Manage membership requests for your club</p>
        </div>
        <Button variant="outline" onClick={loadRequests} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingRequests.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{approvedRequests.length}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <X className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{rejectedRequests.length}</p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="all">All Status</option>
                 <option value="under_review">Under Review</option>
                 <option value="background_check">Background Check</option>
                 <option value="approved">Approved</option>
                 <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>Review and manage incoming membership applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No membership requests yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start md:items-center gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={request.user.avatarUrl || ''} />
                        <AvatarFallback>{request.user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">
                            {request.user.displayName || 'Anonymous'}
                          </h3>
                          {getStatusBadge(request.status)}
                          <Badge variant="outline">{request.stage.replaceAll('_', ' ')}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{request.user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(request.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {request.message && (
                      <div className="mt-3 ml-14 p-3 bg-muted/50 rounded-md text-sm italic text-muted-foreground border-l-2 border-primary/20">
                        &ldquo;{request.message}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 md:self-center ml-14 md:ml-0">
                    {request.status === 'UNDER_REVIEW' || request.status === 'BACKGROUND_CHECK' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsRejectDialogOpen(true);
                          }}
                          className="text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsApproveDialogOpen(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                           <Check className="h-4 w-4 mr-1.5" />
                           {request.status === 'BACKGROUND_CHECK' ? 'Approve' : 'Move to Background Check'}
                        </Button>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground px-2">
                        Processed on {new Date().toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs remain mostly the same but with small UI tweaks if needed, 
          using standard components is fine */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Membership Request</DialogTitle>
            <DialogDescription>
              You are about to approve the membership request from{' '}
              <span className="font-semibold text-foreground">{selectedRequest?.user.displayName || selectedRequest?.user.email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Notes (optional)
              </label>
              <Textarea
                placeholder="Add any notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
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

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Membership Request</DialogTitle>
            <DialogDescription>
              You are about to reject the membership request from{' '}
              <span className="font-semibold text-foreground">{selectedRequest?.user.displayName || selectedRequest?.user.email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Reason (optional)
              </label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
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
