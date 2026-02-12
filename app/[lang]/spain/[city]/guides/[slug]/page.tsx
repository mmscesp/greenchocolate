import React from 'react';

interface PageProps {
  params: Promise<{ lang: string; city: string; slug: string }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug, city } = await params;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold mb-4 capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="text-lg text-muted-foreground">Guide for {city}</p>
    </div>
  );
}
