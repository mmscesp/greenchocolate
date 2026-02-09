import React from 'react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function SpainPage({ params }: PageProps) {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4">Spain Hub</h1>
      <p className="text-lg text-muted-foreground">Country Overview</p>
    </div>
  );
}
