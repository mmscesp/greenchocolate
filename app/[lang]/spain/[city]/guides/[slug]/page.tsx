import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles } from '@/app/actions/articles';

interface PageProps {
  params: Promise<{ lang: string; city: string; slug: string }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { lang, city, slug } = await params;
  const guide = await getArticleBySlug(slug);

  if (!guide || guide.citySlug !== city) {
    notFound();
  }

  const related = await getRelatedArticles(guide.id, 3);
  const paragraphs = guide.content.split('\n\n').filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <div className="text-xs text-muted-foreground mb-3">{guide.category} - {guide.readTime} min read</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{guide.title}</h1>
        <p className="text-muted-foreground">{guide.excerpt}</p>
      </section>

      <article className="rounded-2xl border bg-card p-8 prose max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-2xl border bg-muted/30 p-6">
        <h2 className="text-xl font-semibold mb-3">Related Guides</h2>
        <div className="space-y-3">
          {related.length > 0 ? related.map((item) => (
            <Link
              key={item.id}
              href={`/${lang}/learn/${item.slug}`}
              className="block rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
            </Link>
          )) : (
            <p className="text-sm text-muted-foreground">No related guides available.</p>
          )}
        </div>
      </section>

      <div>
        <Link href={`/${lang}/spain/${city}/guides`} className="text-sm text-primary hover:underline">
          Back to {city} guides
        </Link>
      </div>
    </div>
  );
}
