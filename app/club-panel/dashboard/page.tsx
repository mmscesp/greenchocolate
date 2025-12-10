'use client';

import { StatsCard } from '@/components/admin/StatsCard';
import { Card } from '@/components/ui/card';
import { mockClubData, mockMembers, mockRequests, mockEvents } from '@/lib/mock-admin-data';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const pendingRequests = mockRequests.filter((r) => r.status === 'pending').length;
  const upcomingEvents = mockEvents.filter((e) => new Date(e.date) > new Date()).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockClubData.name}</h1>
        <p className="text-gray-600">{mockClubData.location}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Members" value={mockClubData.members} icon={Users} color="green" />
        <StatsCard title="Pending Requests" value={pendingRequests} icon={FileText} color="blue" />
        <StatsCard title="Upcoming Events" value={upcomingEvents} icon={Calendar} color="orange" />
        <StatsCard title="Capacity Used" value={`${((mockClubData.members / mockClubData.capacity) * 100).toFixed(0)}%`} icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Club Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-gray-900">{mockClubData.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Founded</p>
              <p className="text-gray-900">{mockClubData.foundedYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Capacity</p>
              <p className="text-gray-900">{mockClubData.capacity} members</p>
            </div>
            <Link href="/club-panel/dashboard/profile">
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Edit Profile</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/club-panel/dashboard/profile">
              <Button variant="outline" className="w-full justify-start">
                Update Club Details
              </Button>
            </Link>
            <Link href="/club-panel/dashboard/requests">
              <Button variant="outline" className="w-full justify-start">
                Review {pendingRequests} Pending Requests
              </Button>
            </Link>
            <Link href="/club-panel/dashboard/events">
              <Button variant="outline" className="w-full justify-start">
                Manage Events
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
