import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    title: 'Is Weed Legal in Barcelona in 2026?',
    slug: 'is-weed-legal-barcelona-2026',
    category: 'Legal',
    excerpt: 'The real rules, fines, and grey areas explained.',
  },
  {
    title: '5 Mistakes Tourists Make',
    slug: '5-mistakes-tourists-make',
    category: 'Etiquette',
    excerpt: "Don't be that tourist. Learn the local norms.",
  },
  {
    title: 'Edibles Safety Guide',
    slug: 'edibles-safety-guide',
    category: 'Harm Reduction',
    excerpt: 'Dosing, timing, and avoiding a bad experience.',
  },
];

export default function EditorialFeedSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
           <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest from the Vault</h2>
            <p className="mt-2 text-muted-foreground">Expert guides on legal compliance, safety, and culture</p>
           </div>
           <Link href="/editorial" className="inline-flex items-center text-primary hover:underline font-medium">
             View all articles <ArrowRight className="ml-2 h-4 w-4" />
           </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/editorial/${article.slug}`} className="group block">
              <div className="bg-card border rounded-xl overflow-hidden h-full hover:border-primary/50 transition-colors">
                <div className="aspect-video bg-muted/50" />
                <div className="p-6">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{article.category}</div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
