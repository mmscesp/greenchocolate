'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Star, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin,
  ThumbsUp,
  MessageCircle,
  Filter,
  Search
} from 'lucide-react';

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
  const { t } = useLanguage();
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
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('user.my_reviews')}</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus reseñas y comparte tu experiencia con la comunidad
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reseñas</p>
              <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-green-600">
                {reviews.reduce((sum, review) => sum + review.likes, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Respuestas</p>
              <p className="text-2xl font-bold text-purple-600">
                {reviews.reduce((sum, review) => sum + review.replies, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar reseñas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value={0}>Todas las valoraciones</option>
              <option value={5}>5 estrellas</option>
              <option value={4}>4 estrellas</option>
              <option value={3}>3 estrellas</option>
              <option value={2}>2 estrellas</option>
              <option value={1}>1 estrella</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-6">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                {/* Review Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={review.clubImage}
                      alt={review.clubName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          href={`/clubs/${review.clubId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                        >
                          {review.clubName}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{review.clubNeighborhood}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(review.date).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {review.isEditable && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteReview(review.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {review.rating}/5
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.title}
                  </h3>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Review Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{review.replies} respuestas</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || ratingFilter ? 'No se encontraron reseñas' : 'No has escrito reseñas aún'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || ratingFilter
                ? 'Prueba ajustando los filtros de búsqueda'
                : 'Visita clubs y comparte tu experiencia con la comunidad'
              }
            </p>
            {!searchQuery && !ratingFilter && (
              <Link href="/clubs">
                <Button variant="cannabis">
                  {t('nav.explore')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}