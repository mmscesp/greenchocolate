import { getArticles } from '@/app/actions/articles';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Users, Camera, Smartphone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function EtiquettePage() {
  const articles = await getArticles({ category: 'Etiquette' });

  const etiquetteGuides = [
    {
      title: '5 Mistakes Tourists Make',
      slug: 'etiquette/5-mistakes-tourists-make',
      excerpt: 'Don\'t be "that" tourist. Learn the local norms and club etiquette before you arrive.',
      readTime: 6,
      featured: true,
    },
    {
      title: 'Photography Rules: What You Need to Know',
      slug: 'etiquette/photography-rules-clubs',
      excerpt: 'Why clubs ban photos and how to respect privacy in shared spaces.',
      readTime: 4,
    },
    {
      title: 'Tipping and Contribution Culture',
      slug: 'etiquette/tipping-contribution-culture',
      excerpt: 'Understanding how clubs fund their operations and member expectations.',
      readTime: 5,
    },
    {
      title: 'Conversations with Locals',
      slug: 'etiquette/conversations-locals',
      excerpt: 'How to engage respectfully with club members and staff.',
      readTime: 4,
    },
    {
      title: 'Respecting Club Hierarchy',
      slug: 'etiquette/respecting-club-hierarchy',
      excerpt: 'Understanding club governance and how decisions are made.',
      readTime: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-green-50/50 to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/en/editorial">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Knowledge Vault
              </Link>
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Club Etiquette
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Be a <span className="text-primary">Respectful Guest</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Private cannabis clubs thrive on mutual respect and community. 
              Learn the unwritten rules, understand local customs, and 
              become a valued member of the community rather than a passing tourist.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Core Principles</h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-card border rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Respect Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    No photos, no social media check-ins. What happens in the club stays in the club.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card border rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phones Away</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your phone in your pocket. Looking at it may be seen as disrespectful.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-card border rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No External Guests</h3>
                  <p className="text-sm text-muted-foreground">
                    Clubs are private. You cannot bring guests who are not members.
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Etiquette Guides</h2>
            <div className="grid gap-6">
              {etiquetteGuides.map((article) => (
                <Link
                  key={article.slug}
                  href={`/en/learn/${article.slug}`}
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
