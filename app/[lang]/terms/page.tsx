import Link from 'next/link';

interface TermsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Terms of Use</h1>
        <p className="text-muted-foreground text-lg mb-10">
          SocialClubsMaps provides educational and informational content. We do not sell cannabis,
          broker transactions, or guarantee club acceptance. Users must comply with local laws,
          private association rules, and platform guidelines at all times.
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Educational Purpose</h2>
            <p>
              Content is provided for educational purposes only and does not constitute legal advice.
              Always verify current regulations and seek professional counsel when needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">User Responsibility</h2>
            <p>
              You are responsible for lawful behavior, respectful conduct, and adherence to club policies.
              Public consumption and possession may carry administrative penalties under Spanish law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Transaction Facilitation</h2>
            <p>
              The platform does not facilitate direct drug transactions. Access-related workflows, where
              available, are limited to compliance-first educational and verification steps.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href={`/${lang}/privacy`} className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>
          <Link href={`/${lang}/cookies`} className="text-primary hover:underline font-medium">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
