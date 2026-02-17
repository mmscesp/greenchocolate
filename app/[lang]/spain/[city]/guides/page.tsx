import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getArticles } from '@/app/actions/articles';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight, MapPin, Shield } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityGuidesPage({ params }: PageProps) {
  const { lang, city } = await params;
  const [cityDetail, guides] = await Promise.all([
    getCityBySlug(city),
    getArticles({ citySlug: city, limit: 24 }),
  ]);

  if (!cityDetail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <section
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12 mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <Badge variant="outline" className="border-white/20 text-zinc-400 bg-white/5">
              {cityDetail.name}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              {cityDetail.name}
            </span>{' '}
            Guides
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
            City-specific legal, etiquette, and safety content curated for responsible visitors.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{guides.length}</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Guides</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-blue-400">100%</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Verified</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                <Shield className="h-8 w-8 inline text-purple-400" />
              </div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Safe</div>
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {guides.length > 0 ? guides.map((guide, index) => (
            <div
              key={guide.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <Link
                href={`/${lang}/spain/${city}/guides/${guide.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-500 h-full"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <BookOpen className="h-3 w-3 text-blue-400" />
                    <span className="bg-white/5 px-2 py-1 rounded-full">{guide.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    <span>{guide.readTime} min read</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {guide.title}
                </h2>
                
                <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
                  {guide.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-zinc-500 font-medium">Read Guide</span>
                  <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:w-1/4 transition-all duration-500" />
              </Link>
            </div>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400">No city-specific guides are published for {cityDetail.name} yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
