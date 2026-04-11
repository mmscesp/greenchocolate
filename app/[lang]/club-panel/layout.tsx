import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { buildNoIndexMetadata } from '@/lib/seo';

export const metadata: Metadata = buildNoIndexMetadata();

interface ClubPanelLayoutProps {
  children: ReactNode;
}

export default function ClubPanelLayout({ children }: ClubPanelLayoutProps) {
  return children;
}
