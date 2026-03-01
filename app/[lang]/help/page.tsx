import Link from 'next/link';

interface HelpPageProps {
  params: Promise<{ lang: string }>;
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Start with the core resources below. They cover legal basics, etiquette, safety, and verified club discovery.
        </p>

        <div className="grid gap-4">
          <Link
            href={`/${lang}/editorial/legal`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">Legal guide</h2>
            <p className="text-sm text-muted-foreground">Understand legal boundaries before you travel.</p>
          </Link>

          <Link
            href={`/${lang}/safety-kit`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">Safety kit</h2>
            <p className="text-sm text-muted-foreground">Scam prevention, privacy etiquette, and emergency basics.</p>
          </Link>

          <Link
            href={`/${lang}/clubs`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">Verified directory</h2>
            <p className="text-sm text-muted-foreground">Browse currently available verified clubs by city.</p>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Still stuck?{' '}
          <Link href={`/${lang}/contact`} className="text-primary hover:underline">
            Contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
