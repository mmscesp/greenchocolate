'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Scale, Shield, Heart, History, Clock } from '@/lib/icons';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  heroImage?: string;
  cityName?: string;
}

interface Category {
  name: string;
  count: number;
}

interface EditorialPageClientProps {
  lang: string;
}

// Mock data
const mockCategories: Category[] = [
  { name: 'Legal', count: 5 },
  { name: 'Etiquette', count: 4 },
  { name: 'Harm Reduction', count: 3 },
  { name: 'Culture', count: 6 },
];

const mockFeaturedArticles: Article[] = [
  {
    id: '1',
    slug: 'is-weed-legal-barcelona-2026',
    title: 'Is Weed Legal in Barcelona in 2026?',
    excerpt: 'The real rules, fines, and grey areas explained. What every visitor needs to know before arriving.',
    category: 'Legal',
    readTime: 8,
    cityName: 'Barcelona',
  },
  {
    id: '2',
    slug: '5-mistakes-tourists-make',
    title: '5 Mistakes Tourists Make',
    excerpt: 'Don\'t be "that" tourist. Learn the local norms and club etiquette before you arrive.',
    category: 'Etiquette',
    readTime: 6,
  },
  {
    id: '3',
    slug: 'edibles-safety-guide',
    title: 'Edibles Safety Guide',
    excerpt: 'Start low, go slow. Essential harm reduction tips for cannabis edibles.',
    category: 'Harm Reduction',
    readTime: 5,
  },
];

const CATEGORIES = [
  {
    slug: 'legal',
    title: 'Legal Framework',
    description: 'Understanding Spain\'s cannabis laws, fines, and your rights as a visitor.',
    icon: Scale,
    gradient: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    articleCount: 5,
  },
  {
    slug: 'etiquette',
    title: 'Club Etiquette',
    description: 'Do\'s and don\'ts inside private associations. Be a respectful guest.',
    icon: Heart,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/20',
    articleCount: 4,
  },
  {
    slug: 'safety',
    title: 'Safety & Harm Reduction',
    description: 'Stay safe. Edges, dosing, and emergency protocols.',
    icon: Shield,
    gradient: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    articleCount: 3,
  },
  {
    slug: 'culture',
    title: 'Culture & History',
    description: 'The story behind Spain\'s cannabis social club movement.',
    icon: History,
    gradient: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    articleCount: 6,
  },
];

export default function EditorialPageClient({ lang }: EditorialPageClientProps) {
  const featuredArticles = mockFeaturedArticles;

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-white/20 text-zinc-400 bg-white/5">
                <BookOpen className="w-4 h-4 mr-2" />
                Knowledge Vault
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Navigate Spain&apos;s Cannabis Culture{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Confidently
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-zinc-400 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Authoritative guides on legal compliance, club etiquette, and harm reduction. 
              Built by experts, verified by lawyers, designed for responsible adults.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Browse by Topic
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link
                  href={`/${lang}/editorial/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 hover:border-white/20 transition-all duration-500 block h-full"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${category.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
                  
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl ${category.bgColor} ${category.textColor} mb-4 border ${category.borderColor}`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                      {category.title}
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${category.gradient} rounded-full group-hover:w-1/4 transition-all duration-500`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Articles</h2>
              <Button variant="outline" asChild className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl">
                <Link href={`/${lang}/editorial/legal`}>
                  View all <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    href={`/${lang}/editorial/${article.slug}`}
                    className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-500 h-full"
                  >
                    <div className="aspect-video bg-zinc-800/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                      <Badge className="absolute top-3 left-3 bg-white/10 text-zinc-300 border-white/20" variant="secondary">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime} min read
                        </div>
                        {article.cityName && (
                          <span>{article.cityName}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Our Editorial Standards</h2>
            <p className="text-zinc-400 mb-10">
              Every article in our Knowledge Vault is researched, fact-checked, and reviewed by legal experts and harm reduction specialists.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <Scale className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Legally Verified</h3>
                <p className="text-sm text-zinc-400">
                  Reviewed by legal professionals familiar with Spanish cannabis law
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <Shield className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Harm Reduction Focused</h3>
                <p className="text-sm text-zinc-400">
                  Prioritizing safety and responsible consumption above all
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                  <BookOpen className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Regularly Updated</h3>
                <p className="text-sm text-zinc-400">
                  Laws change. We monitor updates and revise content accordingly
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
