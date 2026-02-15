import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getArticles } from '@/app/actions/articles';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{cityDetail.name} Guides</h1>
        <p className="text-muted-foreground">City-specific legal, etiquette, and safety content curated for responsible visitors.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.length > 0 ? guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/${lang}/spain/${city}/guides/${guide.slug}`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <div className="text-xs text-muted-foreground mb-2">{guide.category} - {guide.readTime} min read</div>
            <h2 className="text-lg font-semibold mb-2">{guide.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-3">{guide.excerpt}</p>
          </Link>
        )) : (
          <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No city-specific guides are published for {cityDetail.name} yet.
          </div>
        )}
      </section>
    </div>
  );
}
