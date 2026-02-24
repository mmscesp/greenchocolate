'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar,
Clock,
MapPin,
Users,
Check,
X,
ExternalLink,
CalendarDays,
Search } from '@/lib/icons';

interface Booking {
  id: string;
  clubId: string;
  clubName: string;
  clubImage: string;
  clubNeighborhood: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  type: 'visit' | 'event' | 'tour';
}

export default function BookingsPage() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      clubId: '1',
      clubName: 'Green Harmony Barcelona',
      clubImage: 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
      clubNeighborhood: 'Gracia',
      date: '2026-02-25',
      time: '19:00',
      guests: 2,
      status: 'confirmed',
      type: 'visit'
    },
    {
      id: '2',
      clubId: '3',
      clubName: 'Sagrada Flora Social',
      clubImage: 'https://images.pexels.com/photos/6231900/pexels-photo-6231900.jpeg',
      clubNeighborhood: 'Eixample',
      date: '2026-03-01',
      time: '20:00',
      guests: 4,
      status: 'pending',
      type: 'event'
    },
    {
      id: '3',
      clubId: '5',
      clubName: 'Barceloneta Beach Club',
      clubImage: 'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
      clubNeighborhood: 'Barceloneta',
      date: '2026-01-15',
      time: '18:30',
      guests: 2,
      status: 'completed',
      type: 'visit'
    }
  ]);

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeFilter === 'upcoming') {
      return bookingDate >= today && booking.status !== 'cancelled';
    }
    if (activeFilter === 'past') {
      return bookingDate < today || booking.status === 'completed' || booking.status === 'cancelled';
    }
    return true;
  });

  const upcomingCount = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today && b.status !== 'cancelled';
  }).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <Check className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'visit': return 'Club Visit';
      case 'event': return 'Event';
      case 'tour': return 'Guided Tour';
      default: return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('user.bookings')}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your club visits and reservations
          </p>
        </div>
        <Link href={`/${language}/clubs`}>
          <Button className="self-start gap-2">
            <CalendarDays className="h-4 w-4" />
            Book New Visit
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Check className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'past'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Club Image */}
                  <Avatar className="w-full md:w-28 h-24 rounded-xl border">
                    <AvatarImage src={booking.clubImage} alt={booking.clubName} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-muted">
                      <MapPin className="h-8 w-8 text-muted-foreground/50" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{booking.clubName}</h3>
                      {getStatusBadge(booking.status)}
                      <Badge variant="secondary" className="text-xs">
                        {getTypeLabel(booking.type)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span>{booking.clubNeighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary/70" />
                        <span>{new Date(booking.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary/70" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary/70" />
                        <span>{booking.guests} guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/${language}/clubs/${booking.clubId}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        View Club
                      </Button>
                    </Link>
                    {booking.status === 'confirmed' && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center shadow-sm">
          <CardContent>
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No bookings found
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {activeFilter === 'upcoming' 
                ? "You don't have any upcoming bookings. Start exploring clubs!"
                : activeFilter === 'past'
                ? "No past bookings yet."
                : "Start booking visits to cannabis social clubs."
              }
            </p>
            <Link href={`/${language}/clubs`}>
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Explore Clubs
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
