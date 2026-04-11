import type { Metadata } from 'next';
import { buildNoIndexMetadata } from '@/lib/seo';
import ProfileLayoutClient from './ProfileLayoutClient';

export const metadata: Metadata = buildNoIndexMetadata();

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileLayoutClient>{children}</ProfileLayoutClient>;
}

