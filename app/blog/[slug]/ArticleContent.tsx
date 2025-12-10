'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { Article } from '@/lib/types';
import { Leaf, Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
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
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
        />
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
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(article.publishedAt).toLocaleDateString('es-ES')}</span>
              </div>
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
              
              {/* Sample expanded content */}
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Contexto Legal en España
              </h2>
              <p className="text-lg leading-relaxed">
                La legislación española sobre cannabis ha evolucionado significativamente en los últimos años. 
                Los clubs sociales operan en un marco legal específico que permite el consumo compartido en 
                espacios privados, siempre bajo estrictas regulaciones de seguridad y responsabilidad.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Beneficios para la Comunidad
              </h2>
              <p className="text-lg leading-relaxed">
                Los clubs sociales de cannabis no solo proporcionan un espacio seguro para el consumo, 
                sino que también fomentan la educación, la investigación y el desarrollo de una cultura 
                cannábica responsable. Estos espacios se han convertido en centros de conocimiento donde 
                los miembros pueden aprender sobre diferentes variedades, métodos de consumo y beneficios 
                terapéuticos.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                El Futuro del Sector
              </h2>
              <p className="text-lg leading-relaxed">
                Con el creciente reconocimiento de los beneficios medicinales del cannabis y la evolución 
                de las actitudes sociales, el sector de los clubs sociales está experimentando un crecimiento 
                sostenido. La profesionalización del sector y el enfoque en la calidad y seguridad están 
                estableciendo nuevos estándares para la industria.
              </p>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{article.author}</h3>
                <p className="text-gray-600">
                  Experto en legislación cannábica y cultura responsable. 
                  Colaborador habitual en publicaciones especializadas del sector.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles CTA */}
        <div className="mt-8 text-center">
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