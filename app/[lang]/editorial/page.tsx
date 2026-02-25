import Link from 'next/link';
import { getArticles, getCategoriesWithCounts, getFeaturedArticles } from '@/app/actions/articles';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Scale, Shield, Heart, History, Clock } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

interface EditorialPageProps {
  params: Promise<{ lang: string }>;
}

export default async function EditorialPage({ params }: EditorialPageProps) {
  const { lang } = await params;
  const [featuredArticles, categories] = await Promise.all([
    getFeaturedArticles(3),
    getCategoriesWithCounts(),
  ]);

  const CATEGORIES = [
    {
      slug: 'legal',
      title: 'Legal Framework',
      description: 'Understanding Spain\'s cannabis laws, fines, and your rights as a visitor.',
      icon: Scale,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      articleCount: categories.find(c => c.name === 'Legal')?.count || 0,
    },
    {
      slug: 'etiquette',
      title: 'Club Etiquette',
      description: 'Do\'s and don\'ts inside private associations. Be a respectful guest.',
      icon: Heart,
      color: 'bg-green-50 text-green-600 border-green-200',
      articleCount: categories.find(c => c.name === 'Etiquette')?.count || 0,
    },
    {
      slug: 'safety',
      title: 'Safety & Harm Reduction',
      description: 'Stay safe. Edges, dosing, and emergency protocols.',
      icon: Shield,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      articleCount: categories.find(c => c.name === 'Harm Reduction')?.count || 0,
    },
    {
      slug: 'culture',
      title: 'Culture & History',
      description: 'The story behind Spain\'s cannabis social club movement.',
      icon: History,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      articleCount: categories.find(c => c.name === 'Culture')?.count || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background pt-24 md:pt-32 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Eyebrow variant="muted" className="mb-6 justify-center flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Vault
            </Eyebrow>
            <H1 size="xl" className="mb-6">
              Navigate Spain's Cannabis Culture <span className="text-primary">Confidently</span>
            </H1>
            <Lead className="mb-8">
              Authoritative guides on legal compliance, club etiquette, and harm reduction.
              Built by experts, verified by lawyers, designed for responsible adults.
            </Lead>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <H2 className="mb-8">Browse by Topic</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${lang}/editorial/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl ${category.color} mb-4`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <H3 className="mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </H3>
                  <Text variant="muted" className="mb-4">
                    {category.description}
                  </Text>
                  <div className="flex items-center justify-between">
                    <Text size="sm" variant="muted">
                      {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                    </Text>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <H2>Featured Articles</H2>
              <Button variant="ghost" asChild>
                <Link href={`/${lang}/editorial/legal`}>
                  View all <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${lang}/learn/${article.slug}`}
                  className="group block bg-card rounded-xl border overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  {article.heroImage && (
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {article.category}
                      </Badge>
                    </div>
                  )}
                  <div className="p-5">
                    <H3 size="sm" className="mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </H3>
                    <Text variant="muted" size="sm" className="line-clamp-2 mb-4">
                      {article.excerpt}
                    </Text>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <H2 className="mb-6">Our Editorial Standards</H2>
            <Text variant="muted" className="mb-10">
              Every article in our Knowledge Vault is researched, fact-checked, and reviewed by legal experts and harm reduction specialists.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-7 h-7 text-primary" />
                </div>
                <H4 className="mb-2">Legally Verified</H4>
                <Text size="sm" variant="muted">
                  Reviewed by legal professionals familiar with Spanish cannabis law
                </Text>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <H4 className="mb-2">Harm Reduction Focused</H4>
                <Text size="sm" variant="muted">
                  Prioritizing safety and responsible consumption above all
                </Text>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <H4 className="mb-2">Regularly Updated</H4>
                <Text size="sm" variant="muted">
                  Laws change. We monitor updates and revise content accordingly
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
