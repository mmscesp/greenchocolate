function expandInlineBulletRun(line: string): string {
  const trimmed = line.trim();

  const labeledListMatch = trimmed.match(/^(.{1,80}:)\s+(-\s+.+)$/);
  if (labeledListMatch) {
    const [, label, rawItems] = labeledListMatch;
    const items = rawItems
      .split(/\s+(?=-\s+)/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length > 1) {
      return `${label}\n${items.join('\n')}`;
    }
  }

  if (trimmed.startsWith('- ') && /\s+-\s+/.test(trimmed.slice(2))) {
    const items = trimmed
      .split(/\s+(?=-\s+)/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length > 1) {
      return items.join('\n');
    }
  }

  return line;
}

function normalizeEditorialStructure(content: string): string {
  return content
    .replace(/([^\n])\s+---\s+(?=#{1,6}\s)/g, '$1\n\n---\n\n')
    .replace(/([^\n])\s+---(?=\s|$)/g, '$1\n\n---')
    .replace(/---\s+(?=#{1,6}\s)/g, '---\n\n')
    .replace(/([^\n])\s+(?=#{1,6}\s)/g, '$1\n\n')
    .split('\n')
    .map(expandInlineBulletRun)
    .join('\n');
}

export function normalizeArticleContent(content: string): string {
  return normalizeEditorialStructure(
    content
      .replace(/\r\n/g, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/^\s*([-_*])\1{2,}\s*$/gm, '---')
      .replace(/[ \t]+\n/g, '\n')
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
