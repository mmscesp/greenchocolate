import Link from 'next/link';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg mb-10">
          We use data minimization principles. We only collect information necessary to provide
          educational content, account features, and safety-focused platform functionality.
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">What We Collect</h2>
            <p>
              We may collect account identifiers, contact details you provide, and usage data required
              for security, fraud prevention, and service improvement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">How We Use Data</h2>
            <p>
              Data is used to operate the platform, provide support, improve reliability, and maintain
              compliance-oriented safeguards. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Your Controls</h2>
            <p>
              You can request access, correction, or deletion of personal data according to applicable
              law and platform policy.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href={`/${lang}/terms`} className="text-primary hover:underline font-medium">
            Terms of Use
          </Link>
          <Link href={`/${lang}/cookies`} className="text-primary hover:underline font-medium">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
