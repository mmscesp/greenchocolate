import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_ROOT = path.join(process.cwd(), 'data/content');

const CATEGORY_MAP: Record<string, string> = {
  legal: 'Legal',
  etiquette: 'Etiquette',
  'harm-reduction': 'Harm Reduction',
  culture: 'Culture',
  safety: 'Harm Reduction',
};

interface ParsedFrontmatter {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface BlogArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  heroImage: string | null;
  heroImageAlt: string | null;
  authorName: string;
  authorAvatar: string | null;
  authorBio: string | null;
  publishedAt: string | null;
  readTime: number;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  citySlug: string | null;
  cityName: string | null;
  featuredOrder: number;
}

function parseFrontmatter(source: string): { frontmatter: ParsedFrontmatter; body: string } {
  if (!source.startsWith('---\n')) {
    return { frontmatter: {}, body: source };
  }

  const end = source.indexOf('\n---\n', 4);
  if (end === -1) {
    return { frontmatter: {}, body: source };
  }

  const rawFrontmatter = source.slice(4, end);
  const body = source.slice(end + 5);
  const frontmatter: ParsedFrontmatter = {};

  for (const line of rawFrontmatter.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.+)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    const rawValue = match[2].trim();

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      try {
        const parsed = JSON.parse(rawValue);
        if (Array.isArray(parsed)) {
          frontmatter[key] = parsed.map((item) => String(item));
          continue;
        }
      } catch {
        // Fall back to string parsing below.
      }
    }

    if (rawValue === 'true' || rawValue === 'false') {
      frontmatter[key] = rawValue === 'true';
      continue;
    }

    if (/^-?\d+$/.test(rawValue)) {
      frontmatter[key] = Number(rawValue);
      continue;
    }

    frontmatter[key] = rawValue.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }

  return { frontmatter, body };
}

function normalizeMdxToMarkdown(body: string): string {
  let result = body;

  result = result.replace(/<AnswerBox>\s*([\s\S]*?)\s*<\/AnswerBox>/g, (_match, inner: string) => {
    return `[!INFO] TL;DR\n${inner.trim()}`;
  });

  result = result.replace(
    /<WarningBox\s+title="([^"]+)"\s*>\s*([\s\S]*?)\s*<\/WarningBox>/g,
    (_match, title: string, inner: string) => `[!WARNING] ${title}\n${inner.trim()}`
  );

  result = result.replace(
    /<SafetyChecklist\s+title="([^"]+)"\s+items=\{\[([\s\S]*?)\]\}\s*\/>/g,
    (_match, title: string, listRaw: string) => {
      const items: string[] = [];
      const itemRegex = /"([^"]+)"/g;
      let itemMatch: RegExpExecArray | null = itemRegex.exec(listRaw);
      while (itemMatch) {
        items.push(`- ${itemMatch[1]}`);
        itemMatch = itemRegex.exec(listRaw);
      }

      return `## ${title}\n${items.join('\n')}`;
    }
  );

  result = result.replace(/<[^>]+>/g, '');

  return result.trim();
}

function wordsToReadTime(text: string): number {
  const plain = text
    .replace(/[#>*`_\-\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plain ? plain.split(' ').length : 0;
  return Math.max(1, Math.ceil(wordCount / 220));
}

async function readCategoryDirectory(categoryDir: string): Promise<string[]> {
  const directoryPath = path.join(CONTENT_ROOT, categoryDir);
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(directoryPath, entry.name));
}

function asString(value: string | number | boolean | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }
  return null;
}

function asStringArray(value: string | number | boolean | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  return [];
}

function asNumber(value: string | number | boolean | string[] | undefined, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && /^-?\d+$/.test(value)) {
    return Number(value);
  }

  return fallback;
}

function asBoolean(value: string | number | boolean | string[] | undefined, fallback: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
  }

  return fallback;
}

async function loadArticleFromFile(filePath: string): Promise<BlogArticleRecord> {
  const source = await fs.readFile(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(source);
  const slug = path.basename(filePath, '.mdx');
  const categoryDir = path.basename(path.dirname(filePath));
  const normalizedBody = normalizeMdxToMarkdown(body);
  const publishedAtRaw = asString(frontmatter.publishedAt) ?? asString(frontmatter.date);
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw).toISOString() : null;
  const mappedCategory = CATEGORY_MAP[categoryDir] ?? categoryDir;

  return {
    id: asString(frontmatter.id) ?? slug,
    slug,
    title: asString(frontmatter.title) ?? slug,
    excerpt: asString(frontmatter.excerpt) ?? '',
    content: normalizedBody,
    category: asString(frontmatter.category) ?? mappedCategory,
    tags: asStringArray(frontmatter.tags),
    heroImage: asString(frontmatter.heroImage),
    heroImageAlt: asString(frontmatter.heroImageAlt),
    authorName: asString(frontmatter.authorName) ?? asString(frontmatter.author) ?? 'Editorial Team',
    authorAvatar: asString(frontmatter.authorAvatar),
    authorBio: asString(frontmatter.authorBio),
    publishedAt,
    readTime: asNumber(frontmatter.readTime, wordsToReadTime(normalizedBody)),
    isPublished: asBoolean(frontmatter.isPublished, true),
    metaTitle: asString(frontmatter.metaTitle),
    metaDescription: asString(frontmatter.metaDescription),
    citySlug: asString(frontmatter.citySlug),
    cityName: asString(frontmatter.cityName),
    featuredOrder: asNumber(frontmatter.featuredOrder, 0),
  };
}

export async function getAllBlogArticles(): Promise<BlogArticleRecord[]> {
  const categoryDirs = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const fileReadTasks = categoryDirs
    .filter((entry) => entry.isDirectory())
    .map((entry) => readCategoryDirectory(entry.name));

  const filesByCategory = await Promise.all(fileReadTasks);
  const files = filesByCategory.flat();
  const articleTasks = files.map((filePath) => loadArticleFromFile(filePath));
  const articles = await Promise.all(articleTasks);

  return articles
    .filter((article) => article.isPublished)
    .sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticleRecord | null> {
  const articles = await getAllBlogArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
