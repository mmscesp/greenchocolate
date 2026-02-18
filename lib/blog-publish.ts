import { Buffer } from 'buffer';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_ROOT = path.join(process.cwd(), 'data/content');

const CATEGORY_PATH_MAP: Record<string, string> = {
  legal: 'legal',
  etiquette: 'etiquette',
  'harm-reduction': 'harm-reduction',
  culture: 'culture',
};

export interface PublishArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  category: keyof typeof CATEGORY_PATH_MAP;
  content: string;
  tags: string[];
  authorName: string;
  authorBio?: string;
  heroImage?: string;
  heroImageAlt?: string;
  citySlug?: string;
  cityName?: string;
  readTime?: number;
  featuredOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
}

export interface PublishArticleResult {
  path: string;
  mode: 'local' | 'github';
  commitSha?: string;
  contentHash: string;
  rollback: {
    existed: boolean;
    previousHash: string | null;
    backupPath?: string;
    previousCommitSha?: string;
  };
}

interface GitHubEnv {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

function getPublishMode(): 'local' | 'github' {
  const configured = process.env.BLOG_PUBLISH_MODE;
  if (configured === 'local' || configured === 'github') {
    return configured;
  }

  if (process.env.NODE_ENV === 'production') {
    return 'github';
  }

  return 'local';
}

function getGitHubEnv(): GitHubEnv {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_REPO_BRANCH ?? 'main';
  const token = process.env.GITHUB_CONTENTS_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('Missing GitHub publish env vars: GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_CONTENTS_TOKEN.');
  }

  return { owner, repo, branch, token };
}

function toIsoDate(value?: string): string {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function hashContent(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

function buildFrontmatter(input: PublishArticleInput): string {
  const lines = [
    '---',
    `title: "${input.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${input.excerpt.replace(/"/g, '\\"')}"`,
    `publishedAt: "${toIsoDate(input.publishedAt)}"`,
    `authorName: "${input.authorName.replace(/"/g, '\\"')}"`,
    `tags: ${JSON.stringify(input.tags)}`,
    `isPublished: true`,
  ];

  if (input.authorBio) lines.push(`authorBio: "${input.authorBio.replace(/"/g, '\\"')}"`);
  if (input.heroImage) lines.push(`heroImage: "${input.heroImage.replace(/"/g, '\\"')}"`);
  if (input.heroImageAlt) lines.push(`heroImageAlt: "${input.heroImageAlt.replace(/"/g, '\\"')}"`);
  if (input.citySlug) lines.push(`citySlug: "${input.citySlug.replace(/"/g, '\\"')}"`);
  if (input.cityName) lines.push(`cityName: "${input.cityName.replace(/"/g, '\\"')}"`);
  if (typeof input.readTime === 'number') lines.push(`readTime: ${input.readTime}`);
  if (typeof input.featuredOrder === 'number') lines.push(`featuredOrder: ${input.featuredOrder}`);
  if (input.metaTitle) lines.push(`metaTitle: "${input.metaTitle.replace(/"/g, '\\"')}"`);
  if (input.metaDescription) lines.push(`metaDescription: "${input.metaDescription.replace(/"/g, '\\"')}"`);

  lines.push('---');
  return `${lines.join('\n')}\n\n${input.content.trim()}\n`;
}

function buildContentPath(input: PublishArticleInput): string {
  const categoryPath = CATEGORY_PATH_MAP[input.category];
  return `data/content/${categoryPath}/${input.slug}.mdx`;
}

async function publishLocally(filePath: string, content: string): Promise<PublishArticleResult> {
  const absolutePath = path.join(process.cwd(), filePath);
  const directory = path.dirname(absolutePath);
  let previousContent: string | null = null;

  try {
    previousContent = await fs.readFile(absolutePath, 'utf8');
  } catch {
    previousContent = null;
  }

  let backupPath: string | undefined;
  if (previousContent !== null) {
    const historyDir = path.join(process.cwd(), 'data/content/.history', path.basename(filePath, '.mdx'));
    await fs.mkdir(historyDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `${stamp}.mdx`;
    const backupAbsolutePath = path.join(historyDir, backupFile);
    await fs.writeFile(backupAbsolutePath, previousContent, 'utf8');
    backupPath = path.relative(process.cwd(), backupAbsolutePath).replace(/\\/g, '/');
  }

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf8');

  return {
    path: filePath,
    mode: 'local',
    contentHash: hashContent(content),
    rollback: {
      existed: previousContent !== null,
      previousHash: previousContent ? hashContent(previousContent) : null,
      ...(backupPath ? { backupPath } : {}),
    },
  };
}

async function getExistingGithubSha(env: GitHubEnv, filePath: string): Promise<string | null> {
  const encodedPath = filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  const url = `https://api.github.com/repos/${env.owner}/${env.repo}/contents/${encodedPath}?ref=${encodeURIComponent(env.branch)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'socialclubsmaps-blog-publisher',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to read current GitHub file (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as { sha?: string };
  return payload.sha ?? null;
}

async function publishToGitHub(filePath: string, content: string): Promise<PublishArticleResult> {
  const env = getGitHubEnv();
  const currentSha = await getExistingGithubSha(env, filePath);
  const encodedPath = filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  const url = `https://api.github.com/repos/${env.owner}/${env.repo}/contents/${encodedPath}`;

  const payload: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message: `Publish article: ${path.basename(filePath, '.mdx')}`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: env.branch,
  };

  if (currentSha) {
    payload.sha = currentSha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'socialclubsmaps-blog-publisher',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to publish file to GitHub (${response.status}): ${body}`);
  }

  const body = (await response.json()) as { commit?: { sha?: string } };

  return {
    path: filePath,
    mode: 'github',
    commitSha: body.commit?.sha,
    contentHash: hashContent(content),
    rollback: {
      existed: currentSha !== null,
      previousHash: currentSha,
      ...(currentSha ? { previousCommitSha: currentSha } : {}),
    },
  };
}

export async function publishArticleArtifact(input: PublishArticleInput): Promise<PublishArticleResult> {
  const filePath = buildContentPath(input);
  const content = buildFrontmatter(input);
  const mode = getPublishMode();

  if (mode === 'local') {
    return publishLocally(filePath, content);
  }

  return publishToGitHub(filePath, content);
}

export function isValidCategoryPath(category: string): category is keyof typeof CATEGORY_PATH_MAP {
  return Object.prototype.hasOwnProperty.call(CATEGORY_PATH_MAP, category);
}

export function getSupportedBlogCategories(): string[] {
  return Object.keys(CATEGORY_PATH_MAP);
}

export async function ensureBlogContentDirectories(): Promise<void> {
  await fs.mkdir(CONTENT_ROOT, { recursive: true });
  const categories = Object.values(CATEGORY_PATH_MAP);
  await Promise.all([
    ...categories.map((category) => fs.mkdir(path.join(CONTENT_ROOT, category), { recursive: true })),
    fs.mkdir(path.join(CONTENT_ROOT, '.history'), { recursive: true }),
  ]);
}

export function createPublishContentHash(input: PublishArticleInput): string {
  const canonical = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    content: input.content,
    tags: [...input.tags],
    authorName: input.authorName,
    authorBio: input.authorBio ?? null,
    heroImage: input.heroImage ?? null,
    heroImageAlt: input.heroImageAlt ?? null,
    citySlug: input.citySlug ?? null,
    cityName: input.cityName ?? null,
    readTime: input.readTime ?? null,
    featuredOrder: input.featuredOrder ?? null,
    metaTitle: input.metaTitle ?? null,
    metaDescription: input.metaDescription ?? null,
    publishedAt: input.publishedAt ?? null,
  };

  return hashContent(JSON.stringify(canonical));
}
