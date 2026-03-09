'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cancelCurrentUserBooking, getCurrentUserBookings, type UserBookingItem } from '@/app/actions/users';
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

export default function BookingsPage() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [bookings, setBookings] = useState<UserBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCancellationId, setPendingCancellationId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const bookingItems = await getCurrentUserBookings();
        if (!isMounted) {
          return;
        }

        setBookings(
          bookingItems.map((booking) => ({
            ...booking,
            scheduledFor: new Date(booking.scheduledFor),
            cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : null,
            completedAt: booking.completedAt ? new Date(booking.completedAt) : null,
            createdAt: new Date(booking.createdAt),
            updatedAt: new Date(booking.updatedAt),
          }))
        );
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const now = new Date();

    return bookings.filter((booking) => {
      if (activeFilter === 'upcoming') {
        return booking.scheduledFor >= now && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
      }

      if (activeFilter === 'past') {
        return booking.scheduledFor < now || booking.status === 'COMPLETED' || booking.status === 'CANCELLED';
      }

      return true;
    });
  }, [activeFilter, bookings]);

  const upcomingCount = bookings.filter(
    (booking) =>
      booking.scheduledFor >= new Date() &&
      booking.status !== 'CANCELLED' &&
      booking.status !== 'COMPLETED'
  ).length;

  const handleCancelBooking = async (bookingId: string) => {
    setPendingCancellationId(bookingId);

    try {
      const result = await cancelCurrentUserBooking(bookingId);
      if (!result.success) {
        return;
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: 'CANCELLED',
                cancelledAt: new Date(),
              }
            : booking
        )
      );
    } finally {
      setPendingCancellationId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <Check className="h-3 w-3 mr-1" />
            {t('bookings.status.confirmed')}
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-white/10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <Clock className="h-3 w-3 mr-1" />
            {t('bookings.status.pending')}
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <X className="h-3 w-3 mr-1" />
            {t('bookings.status.cancelled')}
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <Check className="h-3 w-3 mr-1" />
            {t('bookings.status.completed')}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'VISIT': return t('bookings.type.visit');
      case 'EVENT': return t('bookings.type.event');
      case 'TOUR': return t('bookings.type.tour');
      default: return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-white">{t('user.bookings')}</h1>
          <p className="text-zinc-400 mt-1 font-serif italic">
            {t('bookings.subtitle')}
          </p>
        </div>
        <Link href={`/${language}/clubs`}>
          <Button className="self-start gap-2 bg-brand text-bg-base hover:bg-brand-dark rounded-full px-6 py-5 font-black uppercase tracking-widest text-[10px]">
            <CalendarDays className="h-4 w-4" />
            {t('bookings.book_new_visit')}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('bookings.stats.total')}</p>
              <p className="text-3xl font-serif text-white">{isLoading ? '...' : bookings.length}</p>
            </div>
            <div className="bg-brand/10 p-3 rounded-full border border-brand/20">
              <Calendar className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('bookings.stats.upcoming')}</p>
              <p className="text-3xl font-serif text-white">{isLoading ? '...' : upcomingCount}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <Clock className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('bookings.stats.completed')}</p>
              <p className="text-3xl font-serif text-white">
                {bookings.filter((booking) => booking.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <Check className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('bookings.stats.pending')}</p>
              <p className="text-3xl font-serif text-white">
                {bookings.filter((booking) => booking.status === 'PENDING').length}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <Clock className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'past'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeFilter === filter
                ? 'bg-gold text-black shadow-lg shadow-gold/20'
                : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {t(`bookings.filters.${filter}`)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-2xl hover:border-gold/30 transition-all duration-300 bg-bg-base border border-white/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Club Image */}
                  <Avatar className="w-full md:w-32 h-24 rounded-2xl border-2 border-gold/20 shadow-lg">
                    <AvatarImage src={booking.clubImage || undefined} alt={booking.clubName} className="object-cover" />
                    <AvatarFallback className="rounded-2xl bg-gold text-black">
                      <MapPin className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif text-white">{booking.clubName}</h3>
                      {getStatusBadge(booking.status)}
                      <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest bg-white/5 text-zinc-400 border border-white/5 px-2 py-0.5 rounded-md">
                        {getTypeLabel(booking.type)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gold" />
                        <span>{booking.clubNeighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gold" />
                        <span>{new Date(booking.scheduledFor).toLocaleDateString(language, { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold" />
                        <span>{new Date(booking.scheduledFor).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gold" />
                        <span>{booking.guestCount} {t('bookings.guests')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link href={`/${language}/clubs/${booking.clubSlug}`}>
                      <Button variant="secondary" size="sm" className="gap-2 rounded-full border-white/10 hover:bg-white/5 hover:text-white uppercase tracking-widest text-[9px] font-bold h-9">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t('bookings.view_club')}
                      </Button>
                    </Link>
                    {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full uppercase tracking-widest text-[9px] font-bold h-9"
                        disabled={pendingCancellationId === booking.id}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        {t('bookings.cancel')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center shadow-2xl bg-bg-base border border-white/5">
          <CardContent>
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Calendar className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">
              {t('bookings.empty.title')}
            </h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-serif italic">
              {activeFilter === 'upcoming' 
                ? t('bookings.empty.upcoming')
                : activeFilter === 'past'
                ? t('bookings.empty.past')
                : t('bookings.empty.all')
              }
            </p>
            <Link href={`/${language}/clubs`}>
              <Button className="gap-2 bg-gold text-black hover:bg-gold-dark rounded-full px-8 py-6 font-black uppercase tracking-widest text-[10px]">
                <Search className="h-4 w-4" />
                {t('bookings.explore_clubs')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
