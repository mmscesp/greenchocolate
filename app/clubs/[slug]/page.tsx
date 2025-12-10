import { notFound } from 'next/navigation';
import ClubProfileContent from './ClubProfileContent';
import clubsData from '@/data/dummy-clubs.json';
import { Club } from '@/lib/types';

interface ClubPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all clubs
export async function generateStaticParams() {
  const clubs = clubsData as Club[];
  
  return clubs.map((club) => ({
    slug: club.slug,
  }));
}

export default function ClubPage({ params }: ClubPageProps) {
  const clubs = clubsData as Club[];
  const club = clubs.find(c => c.slug === params.slug);

  if (!club) {
    notFound();
  }

  return <ClubProfileContent club={club} />;
}