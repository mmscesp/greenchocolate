import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Locale } from '@/lib/i18n-config';
import { User } from 'lucide-react';

interface NavbarProps {
  lang?: Locale;
}

export default function VerifiedNavbar({ lang = 'en' }: NavbarProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center space-x-2 font-bold text-xl">
          <span>CSC Platform</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Verified</span>
        </Link>
        <div className="flex items-center space-x-6">
           <Link href={`/${lang}/dashboard`} className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href={`/${lang}/account/requests`} className="text-sm font-medium transition-colors hover:text-primary">
            My Requests
          </Link>
          <Link href={`/${lang}/spain/barcelona/clubs`} className="text-sm font-medium transition-colors hover:text-primary">
            Browse Clubs
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${lang}/account`}>
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
