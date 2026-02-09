import React from 'react';

interface PageProps {
  params: Promise<{ lang: string; city: string; slug: string }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug, city } = await params;
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4 capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="text-lg text-muted-foreground">Guide for {city}</p>
    </div>
  );
}
