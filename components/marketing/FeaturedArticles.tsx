'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, BookOpen, Calendar, User } from '@/lib/icons';
import type { ArticleCard } from '@/app/actions/articles';

interface FeaturedArticlesProps {
  articles: ArticleCard[];
}

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Legal: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  Safety: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  Culture: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  Guide: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  Health: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

function getCategoryColors(category: string) {
  return categoryColors[category] || { bg: 'bg-zinc-50', text: 'text-zinc-600', border: 'border-zinc-200' };
}

function ArticleCard({ article, index }: { article: ArticleCard; index: number }) {
  const colors = getCategoryColors(article.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/editorial/${article.slug}`}>
        <article className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
            {article.heroImage ? (
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-zinc-300" />
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border} backdrop-blur-sm`}>
                {article.category}
              </span>
            </div>

            {/* Read Time Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-zinc-700">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} min
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            {/* Title */}
            <h3 className="text-xl font-bold text-zinc-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300 leading-tight">
              {article.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
              {article.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              {/* Author */}
              <div className="flex items-center gap-2">
                {article.authorAvatar ? (
                   <Image
                     src={article.authorAvatar}
                     alt={article.authorName}
                     width={32}
                     height={32}
                     className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                   />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-medium text-zinc-600">
                  {article.authorName}
                </span>
              </div>

              {/* Read More */}
              <motion.div 
                className="flex items-center gap-1 text-sm font-bold text-green-600"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                Read
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>

            {/* Date */}
            {article.publishedAt && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                <Calendar className="h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            )}
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-green-400 transition-colors duration-500 pointer-events-none" />
        </article>
      </Link>
    </motion.div>
  );
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
