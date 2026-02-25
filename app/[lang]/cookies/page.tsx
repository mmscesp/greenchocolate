import Link from 'next/link';

interface CookiesPageProps {
  params: Promise<{ lang: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Cookie Policy</h1>
        <p className="text-muted-foreground text-lg mb-10">
          We use cookies and similar technologies for essential functionality, security,
          and consented analytics.
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Essential Cookies</h2>
            <p>
              Required for core site functions such as language preference, session continuity,
              and security controls.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Analytics Cookies</h2>
            <p>
              Used only where applicable under consent rules to understand product performance
              and improve user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Managing Preferences</h2>
            <p>
              You can adjust cookie preferences at any time through browser controls and future
              in-product preference settings.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href={`/${lang}/terms`} className="text-primary hover:underline font-medium">
            Terms of Use
          </Link>
          <Link href={`/${lang}/privacy`} className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
