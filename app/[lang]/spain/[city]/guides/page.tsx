import React from 'react';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityGuidesPage({ params }: PageProps) {
  const { city } = await params;
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4 capitalize">{city} Guides</h1>
      <p className="text-lg text-muted-foreground">City Specific Editorial</p>
    </div>
  );
}
