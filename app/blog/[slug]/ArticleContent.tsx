'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { ArticleDetail, ArticleCard } from '@/app/actions/articles';
import { Leaf, Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface ArticleContentProps {
  article: ArticleDetail;
  relatedArticles?: ArticleCard[];
}

export default function ArticleContent({ article, relatedArticles = [] }: ArticleContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">SocialClubsMaps</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('nav.back_to_blog')}
                </Button>
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        {article.heroImage && (
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
              {article.category}
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{article.authorName}</span>
              </div>
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{article.readTime} {t('blog.min_read')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm">
          {/* Article Meta */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              {t('blog.share')}
            </Button>
          </div>

          {/* Article Excerpt */}
          <div className="text-xl text-gray-600 leading-relaxed mb-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            {article.excerpt}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center overflow-hidden relative">
                {article.authorAvatar ? (
                  <Image 
                    src={article.authorAvatar} 
                    alt={article.authorName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{article.authorName}</h3>
                {article.authorBio && (
                  <p className="text-gray-600">
                    {article.authorBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('blog.related_articles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative h-48">
                      {related.heroImage ? (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Leaf className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <Badge variant="secondary" className="w-fit mb-2">
                        {related.category}
                      </Badge>
                      <h3 className="font-bold text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                        {related.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {related.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 text-sm text-gray-500 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {related.publishedAt 
                            ? new Date(related.publishedAt).toLocaleDateString('es-ES')
                            : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{related.readTime} min</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More Articles CTA */}
        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="cannabis" size="lg">
              {t('blog.more_articles')}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}