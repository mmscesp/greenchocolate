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
          <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <Check className="h-3 w-3 mr-1" />
            {t('bookings.status.confirmed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-white/10 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <Clock className="h-3 w-3 mr-1" />
            {t('bookings.status.pending')}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <X className="h-3 w-3 mr-1" />
            {t('bookings.status.cancelled')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">
            <Check className="h-3 w-3 mr-1" />
            {t('bookings.status.completed')}
          </Badge>
        );
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
            <Check className="h-3 w-3 mr-1" />
            {t('bookings.status.confirmed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-brand/10 text-brand border-brand/20">
            <Clock className="h-3 w-3 mr-1" />
            {t('bookings.status.pending')}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
            <X className="h-3 w-3 mr-1" />
            {t('bookings.status.cancelled')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
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
      case 'visit': return t('bookings.type.visit');
      case 'event': return t('bookings.type.event');
      case 'tour': return t('bookings.type.tour');
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
              <p className="text-3xl font-serif text-white">{bookings.length}</p>
            </div>
            <div className="bg-brand/10 p-3 rounded-full border border-brand/20">
              <Calendar className="h-6 w-6 text-brand" />
              <Calendar className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('bookings.stats.upcoming')}</p>
              <p className="text-3xl font-serif text-white">{upcomingCount}</p>
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
                {bookings.filter(b => b.status === 'completed').length}
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
                {bookings.filter(b => b.status === 'pending').length}
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
                    <AvatarImage src={booking.clubImage} alt={booking.clubName} className="object-cover" />
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
                        <span>{new Date(booking.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gold" />
                        <span>{booking.guests} {t('bookings.guests')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link href={`/${language}/clubs/${booking.clubId}`}>
                      <Button variant="secondary" size="sm" className="gap-2 rounded-full border-white/10 hover:bg-white/5 hover:text-white uppercase tracking-widest text-[9px] font-bold h-9">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t('bookings.view_club')}
                      </Button>
                    </Link>
                    {booking.status === 'confirmed' && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full uppercase tracking-widest text-[9px] font-bold h-9">
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
