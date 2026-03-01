import Link from 'next/link';
import { Mail } from '@/lib/icons';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Contact</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Need help with a listing, guide, or safety question? Reach us directly and we will get back to you.
        </p>

        <div className="rounded-2xl border bg-card p-6 md:p-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <Mail className="h-4 w-4" />
            hello@socialclubsmaps.com
          </div>
          <p className="text-sm text-muted-foreground">
            For urgent safety concerns, include your city and a short summary so we can route your message faster.
          </p>
          <a
            href="mailto:hello@socialclubsmaps.com"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Email the team
          </a>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          Looking for legal and safety resources first?{' '}
          <Link href={`/${lang}/editorial`} className="text-primary hover:underline">
            Open the guides
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
