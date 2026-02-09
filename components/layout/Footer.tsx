import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-lg mb-4 block">CSC Platform</Link>
            <p className="text-sm text-muted-foreground">
              Navigate Spain’s cannabis social club culture safely and respectfully.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/en/spain/barcelona" className="text-muted-foreground hover:text-primary">Barcelona</Link></li>
              <li><Link href="/en/spain/madrid" className="text-muted-foreground hover:text-primary">Madrid</Link></li>
              <li><Link href="/en/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/en/editorial/legal" className="text-muted-foreground hover:text-primary">Legal Framework</Link></li>
              <li><Link href="/en/safety" className="text-muted-foreground hover:text-primary">Safety & Harm Reduction</Link></li>
              <li><Link href="/en/editorial/etiquette" className="text-muted-foreground hover:text-primary">Etiquette</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/en/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/en/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><span className="text-muted-foreground text-xs block mt-4">18+ Only. We do not sell cannabis.</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CSC Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
