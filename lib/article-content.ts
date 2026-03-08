export function normalizeArticleContent(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/^\s*([-_*])\1{2,}\s*$/gm, '---')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

