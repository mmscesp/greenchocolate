import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Navigate Spain’s CSC Culture Safely
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          The verified guide to membership, etiquette, and responsible use in Barcelona and beyond. Trust, compliance, and community.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="rounded-full px-8 text-lg font-medium">
             <Link href="#safety-kit">Get the Visitor Safety Kit</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-full px-8 text-lg font-medium">
            <Link href="/en/spain/barcelona">Explore Barcelona</Link>
          </Button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Data Privacy First
          </div>
          <div className="flex items-center gap-2">
             <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Verified Listings Only
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            Harm Reduction Focused
          </div>
        </div>
      </div>
    </section>
  );
}
