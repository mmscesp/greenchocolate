'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { Star, 
Edit3, 
Trash2, 
Calendar, 
MapPin,
ThumbsUp,
MessageCircle,
Filter,
Search } from '@/lib/icons';

interface Review {
  id: string;
  clubId: string;
  clubName: string;
  clubImage: string;
  clubNeighborhood: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  replies: number;
  isEditable: boolean;
}

export default function ReviewsPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  
  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      clubId: '1',
      clubName: 'Green Harmony Madrid',
      clubImage: 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg',
      clubNeighborhood: 'Malasaña',
      rating: 5,
      title: 'Experiencia increíble en Malasaña',
      content: 'Un ambiente muy acogedor y relajado. El personal es súper amable y conocedor. Las instalaciones están impecables y la variedad de productos es excelente. Definitivamente volveré.',
      date: '2024-01-15',
      likes: 12,
      replies: 3,
      isEditable: true
    },
    {
      id: '2',
      clubId: '2',
      clubName: 'Cannabis Culture Centro',
      clubImage: 'https://images.pexels.com/photos/6231900/pexels-photo-6231900.jpeg',
      clubNeighborhood: 'Centro',
      rating: 4,
      title: 'Buen club en el centro',
      content: 'Ubicación perfecta en el centro de Madrid. El ambiente es más formal pero muy educativo. Los talleres que organizan son muy interesantes.',
      date: '2024-01-10',
      likes: 8,
      replies: 1,
      isEditable: true
    },
    {
      id: '3',
      clubId: '4',
      clubName: 'Latina Green Collective',
      clubImage: 'https://images.pexels.com/photos/7492875/pexels-photo-7492875.jpeg',
      clubNeighborhood: 'La Latina',
      rating: 5,
      title: 'Ambiente festivo y social',
      content: 'Me encanta la terraza y los eventos que organizan. Es perfecto para socializar y conocer gente nueva. La música en vivo es un plus.',
      date: '2024-01-05',
      likes: 15,
      replies: 5,
      isEditable: true
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchQuery || 
      review.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const deleteReview = (reviewId: string) => {
    if (confirm(t('reviews.confirm_delete'))) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-brand text-brand' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-white">{t('user.my_reviews')}</h1>
        <p className="text-zinc-400 mt-1 font-serif italic">
          {t('reviews.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('reviews.stats.total')}</p>
              <p className="text-3xl font-serif text-white">{reviews.length}</p>
            </div>
            <div className="bg-brand/10 p-3 rounded-full border border-brand/20">
              <MessageCircle className="h-6 w-6 text-brand" />
              <MessageCircle className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('reviews.stats.average_rating')}</p>
              <p className="text-3xl font-serif text-white">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <Star className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('reviews.stats.total_likes')}</p>
              <p className="text-3xl font-serif text-white">
                {reviews.reduce((sum, review) => sum + review.likes, 0)}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <ThumbsUp className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('reviews.stats.replies')}</p>
              <p className="text-3xl font-serif text-white">
                {reviews.reduce((sum, review) => sum + review.replies, 0)}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-full border border-white/10">
              <MessageCircle className="h-6 w-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-2xl bg-bg-base border border-white/5">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder={t('reviews.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-gold/50 focus:ring-gold/20 h-11 rounded-xl"
              />
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-40">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 z-10" />
                <Select
                  value={ratingFilter.toString()}
                  onValueChange={(value) => setRatingFilter(Number(value))}
                >
                  <SelectTrigger className="w-full sm:w-40 min-h-11 pl-9 bg-white/5 border-white/10 text-white rounded-xl focus:ring-gold/20 focus:border-gold/50">
                    <SelectValue placeholder={t('reviews.filter.all')} />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-base border border-white/10 text-white">
                    <SelectItem value="0" className="focus:bg-white/10 focus:text-white">{t('reviews.filter.all')}</SelectItem>
                    <SelectItem value="5" className="focus:bg-white/10 focus:text-white">{t('reviews.filter.5_stars')}</SelectItem>
                    <SelectItem value="4" className="focus:bg-white/10 focus:text-white">{t('reviews.filter.4_stars')}</SelectItem>
                    <SelectItem value="3" className="focus:bg-white/10 focus:text-white">{t('reviews.filter.3_stars')}</SelectItem>
                    <SelectItem value="2" className="focus:bg-white/10 focus:text-white">{t('reviews.filter.2_stars')}</SelectItem>
                    <SelectItem value="1" className="focus:bg-white/10 focus:text-white">{t('reviews.filter.1_star')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <Card key={review.id} className="hover:shadow-2xl hover:border-gold/30 transition-all duration-300 overflow-hidden bg-bg-base border border-white/5">
              <CardContent className="p-6">
                {/* Review Header */}
                <div className="flex items-start gap-5 mb-5">
                  <Avatar className="h-16 w-16 rounded-2xl border-2 border-gold/20 shadow-lg">
                    <AvatarImage src={review.clubImage} alt={review.clubName} className="object-cover" />
                    <AvatarFallback className="rounded-2xl bg-gold text-black font-black uppercase text-xl">{review.clubName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/${language}/clubs/${review.clubId}`}
                          className="text-xl font-serif text-white hover:text-gold transition-colors truncate block mb-1"
                        >
                          {review.clubName}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-gold" />
                            <span>{review.clubNeighborhood}</span>
                          </div>
                          <span className="text-zinc-700">•</span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gold" />
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {review.isEditable && (
                          <>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteReview(review.id)}
                              className="h-9 w-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating and Title */}
                <div className="mb-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-md">
                      {review.rating}/5
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {review.title}
                  </h3>
                </div>

                {/* Review Content */}
                <p className="text-zinc-400 leading-relaxed mb-6 font-serif italic pl-1 border-l-2 border-gold/30">
                  "{review.content}"
                </p>

                {/* Review Stats */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <ThumbsUp className="h-4 w-4 text-gold" />
                    <span>{review.likes} {t('reviews.likes')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <MessageCircle className="h-4 w-4 text-gold" />
                    <span>{review.replies} {t('reviews.replies')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto text-center py-12 shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-8">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              {searchQuery || ratingFilter ? (
                <Search className="h-8 w-8 text-zinc-600" />
              ) : (
                <Star className="h-8 w-8 text-zinc-600" />
              )}
            </div>
            <h3 className="text-xl font-serif text-white mb-2">
              {searchQuery || ratingFilter ? t('reviews.no_results_search') : t('reviews.no_results_empty')}
            </h3>
            <p className="text-zinc-500 mb-8 font-serif italic">
              {searchQuery || ratingFilter
                ? t('reviews.no_results_search_desc')
                : t('reviews.no_results_empty_desc')
              }
            </p>
            {!searchQuery && !ratingFilter && (
              <Link href={`/${language}/clubs`}>
                <Button className="bg-gold text-black hover:bg-gold-dark rounded-full px-8 py-6 font-black uppercase tracking-widest text-[10px]">
                  {t('nav.explore')}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
