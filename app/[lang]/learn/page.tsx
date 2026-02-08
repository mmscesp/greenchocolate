import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getArticles, getCategoriesWithCounts, getFeaturedArticles } from '@/app/actions/articles';
import BlogFilters from './BlogFilters';
import TrustBadge from '@/components/trust/TrustBadge';
import { Search, Calendar, Clock, User, ArrowRight, BookOpen, Shield, Scale, Info } from 'lucide-react';

// ISR: Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Knowledge Hub | SocialClubsMaps',
  description: 'Your verified navigation layer for Spain\'s cannabis culture. Expert-vetted guides on laws, etiquette, and safety.',
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
    <div className="min-h-screen bg-white">
      {/* Knowledge Hub Header */}
      <div className="bg-zinc-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#22c55e 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-6 uppercase tracking-widest text-xs py-1 px-4">
            Regulatory Wiki
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Knowledge <span className="text-green-500">Hub</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Expert-vetted navigation for Spain's cannabis culture. <br className="hidden md:block" /> 
            Laws, etiquette, and safety protocols—verified by SCM.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar / Wiki Nav */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <BookOpen className="h-3 w-3" /> Navigation
                </h3>
                <nav className="space-y-1">
                  <Link 
                    href="/learn" 
                    className={`block px-3 py-2 rounded-lg text-sm font-bold transition-colors ${!category ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                  >
                    All Documentation
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/learn?category=${encodeURIComponent(cat.name)}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-bold transition-colors ${category === cat.name ? 'bg-green-50 text-green-700' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                    >
                      {cat.name}
                      <span className="ml-2 text-[10px] opacity-50">({cat.count})</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs mb-2">
                  <Shield className="h-3.5 w-3.5 text-green-600" />
                  Trust Guarantee
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  All articles are reviewed by our legal and cultural advisory board to ensure absolute compliance with Spanish Law.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Box */}
            <div className="mb-12">
              <BlogFilters
                categories={categories}
                currentCategory={category}
                currentSearch={searchQuery}
              />
            </div>

            {/* Featured Section */}
            {featuredArticle && !category && !searchQuery && (
              <div className="mb-16 group cursor-pointer">
                <Link href={`/learn/${featuredArticle.slug}`}>
                  <div className="bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 transition-all hover:border-green-500 hover:shadow-2xl">
                    <div className="lg:flex items-stretch">
                      <div className="lg:w-1/2 relative h-64 lg:h-auto">
                        {featuredArticle.heroImage && (
                          <Image
                            src={featuredArticle.heroImage}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-zinc-900/10 group-hover:bg-zinc-900/0 transition-colors"></div>
                      </div>
                      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                        <div className="flex gap-2 mb-6">
                          <TrustBadge variant="expert" />
                          <Badge variant="outline" className="bg-white">{featuredArticle.category}</Badge>
                        </div>
                        <h2 className="text-3xl font-black text-zinc-900 mb-4 group-hover:text-green-600 transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-zinc-600 mb-8 leading-relaxed line-clamp-3 font-medium">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="mt-auto pt-6 border-t border-zinc-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-black uppercase text-zinc-500">
                              {featuredArticle.authorName.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-zinc-900">{featuredArticle.authorName}</span>
                          </div>
                          <div className="flex items-center text-xs font-black text-zinc-400 gap-1 uppercase tracking-tighter">
                            <Clock className="h-3 w-3" /> {featuredArticle.readTime} MIN READ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Wiki Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regularArticles.map((article) => (
                <Link key={article.id} href={`/learn/${article.slug}`}>
                  <article className="group bg-white rounded-2xl border border-zinc-100 p-6 transition-all hover:border-green-500 hover:shadow-xl flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <Badge variant="outline" className="bg-zinc-50 text-zinc-500 text-[10px] font-black border-zinc-200 uppercase tracking-widest px-2">
                        {article.category}
                      </Badge>
                      <TrustBadge variant="verified" className="scale-75 origin-right" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-50">
                      <div className="flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-widest">
                        View Report <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase">
                        {article.readTime} MIN
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-24 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                <Search className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No matching entries</h3>
                <p className="text-zinc-500 mb-8">Try adjusting your search criteria or category filter.</p>
                <Link href="/learn">
                  <Button variant="outline" className="rounded-full px-8">Reset Hub</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}