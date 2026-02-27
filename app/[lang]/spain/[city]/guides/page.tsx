import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getArticles } from '@/app/actions/articles';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight, MapPin, Shield } from '@/lib/icons';
import { H1, H3, Text, Lead } from '@/components/typography';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityGuidesPage({ params }: PageProps) {
  const { lang, city } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const format = (key: string, vars: Record<string, string>) => {
    const template = t(key);
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{{${name}}}`, value),
      template
    );
  };
  const [cityDetail, guides] = await Promise.all([
    getCityBySlug(city),
    getArticles({ citySlug: city, limit: 24 }),
  ]);

  if (!cityDetail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
        {/* Hero Section */}
        <section
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              {cityDetail.name}
            </Badge>
          </div>
          
          <H1 className="mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80">
              {cityDetail.name}
            </span>{' '}
            {t('city_guides.title_suffix')}
          </H1>
          
          <Lead className="max-w-3xl">
            {t('city_guides.lead')}
          </Lead>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-black text-foreground">{guides.length}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('city_guides.stats.guides')}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-primary">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('city_guides.stats.verified')}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-foreground">
                <Shield className="h-8 w-8 inline text-primary" />
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{t('city_guides.stats.safe')}</div>
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
                className="group block rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3 text-primary" />
                    <span className="bg-muted px-2 py-1 rounded-full">{guide.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format('city_guides.min_read', { minutes: String(guide.readTime) })}</span>
                  </div>
                </div>
                
                <H3 className="mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {guide.title}
                </H3>
                
                <Text variant="muted" size="sm" className="line-clamp-3 mb-4">
                  {guide.excerpt}
                </Text>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground font-medium">{t('city_guides.read_guide')}</span>
                  <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <Text variant="muted">{format('city_guides.empty', { city: cityDetail.name })}</Text>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
