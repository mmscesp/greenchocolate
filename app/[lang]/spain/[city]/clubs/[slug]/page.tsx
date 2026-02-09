import React from 'react';

interface PageProps {
  params: Promise<{ lang: string; city: string; slug: string }>;
}

export default async function ClubPage({ params }: PageProps) {
  const { slug, city } = await params;
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4 capitalize">{slug}</h1>
      <p className="text-lg text-muted-foreground">Located in {city}</p>
      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <p>Public Teaser -&gt; Gated Full Profile</p>
      </div>
    </div>
  );
}
