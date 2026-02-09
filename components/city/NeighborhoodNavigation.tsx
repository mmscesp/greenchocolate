import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Neighborhood {
  name: string;
  slug: string;
  vibe: string;
}

interface Props {
  citySlug: string;
  neighborhoods: Neighborhood[];
}

export default function NeighborhoodNavigation({ citySlug, neighborhoods }: Props) {
  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-4">Explore Neighborhoods</h2>
      <div className="flex flex-wrap gap-3">
        {neighborhoods.map((hood) => (
          <Button key={hood.slug} variant="outline" className="h-auto py-2 px-4 flex flex-col items-start gap-1" asChild>
            <Link href={`/en/spain/${citySlug}/neighborhoods/${hood.slug}`}>
              <span className="font-bold">{hood.name}</span>
              <span className="text-xs text-muted-foreground font-normal">{hood.vibe}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
