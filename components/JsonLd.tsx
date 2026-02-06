import React from 'react';

export interface JsonLdProps {
  /**
   * The structured data object to be serialized as JSON-LD.
   * This should follow Schema.org specifications.
   */
  data: Record<string, unknown>;
}

/**
 * A reusable component for rendering Schema.org structured data (JSON-LD).
 * 
 * This component renders a `<script type="application/ld+json">` tag with the provided data.
 * It automatically sanitizes the output to prevent XSS attacks by escaping HTML characters.
 * 
 * @example
 * ```tsx
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   "name": "My Company",
 *   "url": "https://example.com"
 * }} />
 * ```
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
