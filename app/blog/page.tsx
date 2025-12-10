'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import { useArticles } from '@/hooks/useArticles';
import { useLanguage } from '@/hooks/useLanguage';
import { BLOG_CATEGORIES } from '@/lib/constants';
import { Leaf, Search, Calendar, Clock, User, Filter } from 'lucide-react';

export default function BlogPage() {
  const { articles, loading } = useArticles();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles[0];
  const regularArticles = filteredArticles.slice(1);

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
              <Link href="/clubs">
                <Button variant="ghost">{t('nav.explore')}</Button>
              </Link>
              <Link href="/club-panel">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Panel Club</Button>
              </Link>
              <UserProfileDropdown />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('blog.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">{t('blog.all_categories')}</option>
                {BLOG_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                !selectedCategory
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('blog.all')}
            </button>
            {BLOG_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && !selectedCategory && !searchQuery && (
              <div className="mb-12">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="lg:flex">
                    <div className="lg:w-1/2">
                      <div className="relative h-64 lg:h-full">
                        <Image
                          src={featuredArticle.heroImage}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-8">
                      <Badge variant="success" className="mb-3">
                        {t('blog.featured_article')}
                      </Badge>
                      <Badge variant="outline" className="mb-4 ml-2">
                        {featuredArticle.category}
                      </Badge>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{featuredArticle.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredArticle.readTime} {t('blog.min_read')}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${featuredArticle.slug}`}>
                        <Button variant="cannabis">
                          {t('blog.read_article')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map(article => (
                <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-none">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime} {t('blog.min_read')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link href={`/blog/${article.slug}`}>
                      <Button variant="outline" className="w-full">
                        {t('blog.read_more')}
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* No Results */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('blog.no_results.title')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('blog.no_results.subtitle')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                    }}
                  >
                    {t('clubs.clear_filters')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}