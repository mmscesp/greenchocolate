'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRequests } from '@/lib/mock-admin-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleApprove = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
    setSelectedRequest(null);
    toast.success('Request approved');
  };

  const handleReject = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
    setSelectedRequest(null);
    toast.success('Request rejected');
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');

  const getStatusColor = (status: string) => {
    return status === 'pending' ? 'bg-yellow-100 text-yellow-800' : status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Membership Requests</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
          <p className="text-sm text-gray-600">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Requests</h2>
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">{request.name}</h3>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{request.email}</p>
                <p className="text-sm text-gray-500 mt-1">{request.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRequest(request)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest?.name} - {selectedRequest?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Request Date</p>
              <p className="font-semibold">{selectedRequest?.requestDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Message</p>
              <p className="text-gray-900">{selectedRequest?.message}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(selectedRequest?.status)}>{selectedRequest?.status}</Badge>
            </div>
            {selectedRequest?.status === 'pending' && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
