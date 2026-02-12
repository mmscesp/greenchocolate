import { getArticles } from '@/app/actions/articles';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Scale, AlertTriangle, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function LegalPage() {
  const articles = await getArticles({ category: 'Legal' });

  const legalGuides = [
    {
      title: 'Is Weed Legal in Barcelona in 2026?',
      slug: 'legal/is-weed-legal-barcelona-2026',
      excerpt: 'The real rules, fines, and grey areas explained. What every visitor needs to know before arriving.',
      readTime: 8,
      featured: true,
    },
    {
      title: 'Understanding Public Consumption Laws',
      slug: 'legal/public-consumption-laws',
      excerpt: 'Why private clubs exist and what happens if you consume in public spaces.',
      readTime: 6,
    },
    {
      title: 'Your Rights During Police Interaction',
      slug: 'legal/your-rights-police-interaction',
      excerpt: 'What to do if approached by authorities. Know your rights and stay compliant.',
      readTime: 5,
    },
    {
      title: 'The Grey Zone Explained',
      slug: 'legal/grey-zone-explained',
      excerpt: 'Spain\'s unique legal framework and what it means for club members.',
      readTime: 7,
    },
    {
      title: 'Fines and Penalties: A Complete Guide',
      slug: 'legal/fines-penalties-complete-guide',
      excerpt: 'From €601 to more serious consequences. Understanding the enforcement landscape.',
      readTime: 10,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-50/50 to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/en/editorial">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Knowledge Vault
              </Link>
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              Legal Framework
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Understanding Spain's <span className="text-primary">Cannabis Laws</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Spain's relationship with cannabis is nuanced. Unlike Amsterdam's coffee shops, 
              Spain operates under a private association model. Learn what this means for you, 
              your rights, and how to stay compliant.
            </p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Public Consumption is Illegal</h3>
                    <p className="text-sm text-amber-800">
                      Consuming in public spaces can result in fines starting at €601. 
                      Always consume inside the private club premises only.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Private Associations are Legal</h3>
                    <p className="text-sm text-green-800">
                      Clubs operate as private, non-profit associations. Members can 
                      consume on premises when following house rules.
                    </p>
                  </div>
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Legal Guides & Resources</h2>
            <div className="grid gap-6">
              {legalGuides.map((article, index) => (
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

      {/* Disclaimer */}
      <section className="py-12 bg-muted/30 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This information is for educational purposes only 
              and does not constitute legal advice. Laws may change. Consult with a qualified 
              legal professional for advice specific to your situation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
