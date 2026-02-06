import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import { getArticles, getCategoriesWithCounts, getFeaturedArticles } from '@/app/actions/articles';
import { Leaf, Search, Calendar, Clock, User, Filter } from 'lucide-react';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | SocialClubsMaps',
  description: 'Discover articles about cannabis social clubs, health, wellness, and culture.',
};

interface BlogPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const category = searchParams.category;
  const searchQuery = searchParams.search || '';

  // Fetch data in parallel
  const [articles, categories, featuredArticles] = await Promise.all([
    getArticles({ category }),
    getCategoriesWithCounts(),
    getFeaturedArticles(1),
  ]);

  // Filter by search query if provided
  const filteredArticles = searchQuery
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const featuredArticle = featuredArticles[0];
  const regularArticles =
    featuredArticle && !category && !searchQuery
      ? filteredArticles.filter((a) => a.id !== featuredArticle.id)
      : filteredArticles;

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
                <Button variant="ghost">Explorar</Button>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover articles about cannabis social clubs, health, wellness, and culture.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form action="/blog" method="GET" className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </form>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <form action="/blog" method="GET">
                <select
                  name="category"
                  defaultValue={category || ''}
                  onChange={(e) => e.target.form?.submit()}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </form>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href="/blog"
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                !category
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  category === cat.name
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <>
          {/* Featured Article */}
          {featuredArticle && !category && !searchQuery && (
            <div className="mb-12">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="lg:flex">
                  <div className="lg:w-1/2">
                    <div className="relative h-64 lg:h-full">
                      {featuredArticle.heroImage && (
                        <Image
                          src={featuredArticle.heroImage}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-8">
                    <Badge variant="success" className="mb-3">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="mb-4 ml-2">
                      {featuredArticle.category}
                    </Badge>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{featuredArticle.authorName}</span>
                      </div>
                      {featuredArticle.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredArticle.readTime} min read</span>
                      </div>
                    </div>
                    <Link href={`/blog/${featuredArticle.slug}`}>
                      <Button variant="cannabis">Read Article</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  {article.heroImage && (
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/50 text-white border-none">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <Button variant="outline" className="w-full">
                      Read More
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
                <Link href="/blog">
                  <Button variant="outline">Clear Filters</Button>
                </Link>
              </div>
            </div>
          )}
        </>
      </div>

      <Footer />
    </div>
  );
}