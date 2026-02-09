import React from 'react';

interface PageProps {
  params: Promise<{ lang: string; city: string; neighborhood: string }>;
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const { city, neighborhood } = await params;
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4 capitalize">{neighborhood} Guide</h1>
      <p className="text-lg text-muted-foreground">Located in {city}</p>
    </div>
  );
}
