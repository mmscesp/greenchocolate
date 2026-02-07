'use client';

import Script from 'next/script';

interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

interface CollectionPageSchema {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
}

interface LocalBusinessSchema {
  name: string;
  description: string;
  url: string;
  image: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  priceRange: string;
  hasMap: string;
}

export function OrganizationStructuredData({ schema }: { schema: OrganizationSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: schema.name,
    url: schema.url,
    logo: schema.logo,
    description: schema.description,
    sameAs: schema.sameAs,
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CollectionPageStructuredData({ schema }: { schema: CollectionPageSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: schema.name,
    description: schema.description,
    url: schema.url,
    numberOfItems: schema.numberOfItems,
  };

  return (
    <Script
      id="collection-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessStructuredData({ schema }: { schema: LocalBusinessSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: schema.name,
    description: schema.description,
    url: schema.url,
    image: schema.image,
    address: schema.address,
    priceRange: schema.priceRange,
    hasMap: schema.hasMap,
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteStructuredData({ name, url }: { name: string; url: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/clubs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
