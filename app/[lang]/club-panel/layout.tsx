import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

interface ClubPanelLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function ClubPanelLayout({ children: _children, params }: ClubPanelLayoutProps) {
  const { lang } = await params;

  redirect(`/${lang}/contact`);
}
