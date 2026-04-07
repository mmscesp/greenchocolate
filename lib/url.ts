const ABSOLUTE_URL_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//;

/**
 * Ensures URL-like values are absolute for external links and structured data.
 * Adds https:// only when the value has no URL scheme.
 */
export function toAbsoluteHttpUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (ABSOLUTE_URL_SCHEME_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
