import { getArticles } from '@/app/actions/articles';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, History, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CulturePageProps {
  params: Promise<{ lang: string }>;
}

export default async function CulturePage({ params }: CulturePageProps) {
  const { lang } = await params;
  const articles = await getArticles({ category: 'Culture' });

  const cultureGuides = [
    {
      title: 'The Barcelona Cannabis Club Movement',
      slug: 'culture/barcelona-cannabis-club-movement',
      excerpt: 'How a protest movement became a cultural institution. The history behind Spain\'s unique model.',
      readTime: 12,
      featured: true,
    },
    {
      title: 'Interview: Club Founders on 20 Years of Change',
      slug: 'culture/interview-club-founders',
      excerpt: 'Perspectives from pioneers who shaped the movement from the beginning.',
      readTime: 15,
    },
    {
      title: 'From Stigma to Acceptance',
      slug: 'culture/stigma-to-acceptance',
      excerpt: 'How public perception has evolved over the past two decades.',
      readTime: 8,
    },
    {
      title: 'The Club as Community Center',
      slug: 'culture/club-as-community-center',
      excerpt: 'Beyond cannabis—how clubs serve as hubs for art, music, and social connection.',
      readTime: 6,
    },
    {
      title: 'Madrid vs Barcelona: A Cultural Comparison',
      slug: 'culture/madrid-vs-barcelona-comparison',
      excerpt: 'How the two major cities developed different club cultures and atmospheres.',
      readTime: 7,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-purple-50/50 to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link href={`/${lang}/editorial`}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Knowledge Vault
              </Link>
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <History className="w-4 h-4" />
              Culture & History
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              The Story Behind <span className="text-primary">Spain's Movement</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Spain's cannabis social clubs didn't emerge in a vacuum. 
              They are the product of decades of activism, cultural shift, 
              and a uniquely Spanish approach to drug policy reform.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">A Brief History</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <span className="text-sm text-muted-foreground">1990s</span>
                  <h3 className="font-semibold mb-2">The Movement Begins</h3>
                  <p className="text-sm text-muted-foreground">
                    Activists start advocating for cannabis decriminalization. 
                    The concept of "annabis clubs" emerges from social movements.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <span className="text-sm text-muted-foreground">2006-2010</span>
                  <h3 className="font-semibold mb-2">Barcelona Emerges</h3>
                  <p className="text-sm text-muted-foreground">
                    Barcelona becomes the epicenter. The first formal clubs 
                    open, creating a new model for private consumption.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <History className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Present Day</span>
                  <h3 className="font-semibold mb-2">A Growing Movement</h3>
                  <p className="text-sm text-muted-foreground">
                    Thousands of members across Spain. Continued evolution 
                    of the model and ongoing policy discussions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Culture & History Articles</h2>
            <div className="grid gap-6">
              {cultureGuides.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${lang}/learn/${article.slug}`}
                  className="group block bg-card border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {article.featured && (
                          <Badge variant="default" className="bg-primary">
                            Featured
                          </Badge>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime} min read
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {article.excerpt}
                      </p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
