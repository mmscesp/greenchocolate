'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  deleteCurrentUserReview,
  getCurrentUserReviews,
  updateCurrentUserReview,
  type UserReviewItem,
} from '@/app/actions/users';
import { useLanguage } from '@/hooks/useLanguage';
import { Star, 
Edit3, 
Trash2, 
Calendar, 
MapPin,
ThumbsUp,
MessageCircle,
Filter,
Search,
Check,
X } from '@/lib/icons';

export default function ReviewsPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [reviews, setReviews] = useState<UserReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState('5');
  const [editContent, setEditContent] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        const reviewItems = await getCurrentUserReviews();
        if (!isMounted) {
          return;
        }

        setReviews(
          reviewItems.map((review) => ({
            ...review,
            createdAt: new Date(review.createdAt),
            updatedAt: new Date(review.updatedAt),
          }))
        );
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchQuery || 
      review.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  const startEditing = (review: UserReviewItem) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating.toString());
    setEditContent(review.content || '');
    setEditIsPublic(review.isPublic);
  };

  const saveReview = async () => {
    if (!editingReviewId) {
      return;
    }

    const result = await updateCurrentUserReview(editingReviewId, {
      rating: Number(editRating),
      content: editContent,
      isPublic: editIsPublic,
    });

    if (!result.success) {
      return;
    }

    setReviews((prev) =>
      prev.map((review) =>
        review.id === editingReviewId
          ? {
              ...review,
              rating: Number(editRating),
              content: editContent || null,
              isPublic: editIsPublic,
              updatedAt: new Date(),
            }
          : review
      )
    );
    setEditingReviewId(null);
  };

  const deleteReview = async (reviewId: string) => {
    if (confirm(t('reviews.confirm_delete'))) {
      const result = await deleteCurrentUserReview(reviewId);
      if (result.success) {
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      }
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
              <p className="text-3xl font-serif text-white">{isLoading ? '...' : reviews.length}</p>
            </div>
            <div className="bg-brand/10 p-3 rounded-full border border-brand/20">
              <MessageCircle className="h-6 w-6 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl bg-bg-base border border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{t('reviews.stats.average_rating')}</p>
              <p className="text-3xl font-serif text-white">{isLoading ? '...' : averageRating.toFixed(1)}</p>
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
                0
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
                0
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
                    <AvatarImage src={review.clubImage || undefined} alt={review.clubName} className="object-cover" />
                    <AvatarFallback className="rounded-2xl bg-gold text-black font-black uppercase text-xl">{review.clubName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/${language}/clubs/${review.clubSlug}`}
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
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={t('reviews.edit_review')}
                              className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                              onClick={() => startEditing(review)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={t('reviews.delete_review')}
                              onClick={() => deleteReview(review.id)}
                              className="h-9 w-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
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
                    {review.clubName}
                  </h3>
                </div>

                {/* Review Content */}
                {editingReviewId === review.id ? (
                  <div className="mb-6 space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`review-rating-${review.id}`}>{t('reviews.stats.average_rating')}</Label>
                      <Select value={editRating} onValueChange={setEditRating}>
                        <SelectTrigger id={`review-rating-${review.id}`} className="w-full bg-white/5 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-base text-white">
                          {['5', '4', '3', '2', '1'].map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}/5
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`review-content-${review.id}`}>Review</Label>
                      <Textarea
                        id={`review-content-${review.id}`}
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`review-public-${review.id}`}
                        checked={editIsPublic}
                        onCheckedChange={(checked) => setEditIsPublic(Boolean(checked))}
                      />
                      <Label htmlFor={`review-public-${review.id}`}>Show publicly</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="primary" size="sm" className="gap-2" onClick={saveReview}>
                        <Check className="h-4 w-4" />
                        {t('common.save_changes')}
                      </Button>
                      <Button variant="secondary" size="sm" className="gap-2" onClick={() => setEditingReviewId(null)}>
                        <X className="h-4 w-4" />
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-400 leading-relaxed mb-6 font-serif italic pl-1 border-l-2 border-gold/30">
                    "{review.content || review.clubName}"
                  </p>
                )}

                {/* Review Stats */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <ThumbsUp className="h-4 w-4 text-gold" />
                    <span>0 {t('reviews.likes')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <MessageCircle className="h-4 w-4 text-gold" />
                    <span>0 {t('reviews.replies')}</span>
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
