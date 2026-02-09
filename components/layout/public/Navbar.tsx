import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Locale } from '@/lib/i18n-config';

interface NavbarProps {
  lang?: Locale;
}

export default function PublicNavbar({ lang = 'en' }: NavbarProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center space-x-2 font-bold text-xl">
          <span>CSC Platform</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href={`/${lang}/about`} className="text-sm font-medium transition-colors hover:text-primary">
            Methodology
          </Link>
          <Link href={`/${lang}/editorial`} className="text-sm font-medium transition-colors hover:text-primary">
            Knowledge Vault
          </Link>
          <Link href={`/${lang}/spain/barcelona`} className="text-sm font-medium transition-colors hover:text-primary">
            Barcelona
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href={`/${lang}/account/login`}>Log in</Link>
            </Button>
            <Button asChild>
              <Link href={`/${lang}/account/register`}>Visitor Pass</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
