'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type PublishResponse = {
  success?: boolean;
  error?: string;
  details?: Record<string, string[] | undefined>;
  idempotent?: boolean;
  idempotencyKey?: string;
  scopedIdempotencyKey?: string;
  contentHash?: string;
  path?: string | null;
  mode?: string | null;
  commitSha?: string | null;
  rollback?: {
    existed: boolean;
    previousHash: string | null;
    backupPath?: string;
    previousCommitSha?: string;
  };
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildIdempotencyKey(slug: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `publish:${slug}:${crypto.randomUUID()}`;
  }
  return `publish:${slug}:${Date.now()}`;
}

export default function PublishArticleForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<'legal' | 'etiquette' | 'harm-reduction' | 'culture'>('culture');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('Editorial Team');
  const [authorBio, setAuthorBio] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroImageAlt, setHeroImageAlt] = useState('');
  const [citySlug, setCitySlug] = useState('');
  const [cityName, setCityName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [readTime, setReadTime] = useState('');
  const [featuredOrder, setFeaturedOrder] = useState('0');
  const [publishedAt, setPublishedAt] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<PublishResponse | null>(null);

  const suggestedSlug = useMemo(() => slugify(title), [title]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    const effectiveSlug = slugify(slug || suggestedSlug || title);
    const payload = {
      slug: effectiveSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      content: content.trim(),
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      authorName: authorName.trim(),
      ...(authorBio.trim() ? { authorBio: authorBio.trim() } : {}),
      ...(heroImage.trim() ? { heroImage: heroImage.trim() } : {}),
      ...(heroImageAlt.trim() ? { heroImageAlt: heroImageAlt.trim() } : {}),
      ...(citySlug.trim() ? { citySlug: citySlug.trim() } : {}),
      ...(cityName.trim() ? { cityName: cityName.trim() } : {}),
      ...(metaTitle.trim() ? { metaTitle: metaTitle.trim() } : {}),
      ...(metaDescription.trim() ? { metaDescription: metaDescription.trim() } : {}),
      ...(readTime.trim() ? { readTime: Number(readTime) } : {}),
      ...(featuredOrder.trim() ? { featuredOrder: Number(featuredOrder) } : {}),
      ...(publishedAt.trim() ? { publishedAt: new Date(publishedAt).toISOString() } : {}),
    };

    const idempotencyKey = buildIdempotencyKey(effectiveSlug);

    try {
      const result = await fetch('/api/admin/blog/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const json = (await result.json()) as PublishResponse;
      setResponse(json);
      if (result.ok && json.success) {
        setSlug(effectiveSlug);
      }
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Publish request failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish New Article</CardTitle>
        <CardDescription>
          One-click publish to your file-backed editorial pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Article title" required minLength={5} maxLength={180} />
            <Input
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              placeholder={suggestedSlug || 'article-slug'}
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>

          <Textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="SEO excerpt (20-350 chars)" required minLength={20} maxLength={350} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as 'legal' | 'etiquette' | 'harm-reduction' | 'culture')}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="culture">Culture</option>
              <option value="legal">Legal</option>
              <option value="etiquette">Etiquette</option>
              <option value="harm-reduction">Harm Reduction</option>
            </select>
            <Input value={authorName} onChange={(event) => setAuthorName(event.target.value)} placeholder="Author name" required minLength={2} maxLength={120} />
          </div>

          <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="MDX content" required minLength={120} className="min-h-[220px]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags (comma-separated)" />
            <Input value={authorBio} onChange={(event) => setAuthorBio(event.target.value)} placeholder="Author bio (optional)" maxLength={320} />
            <Input value={heroImage} onChange={(event) => setHeroImage(event.target.value)} placeholder="Hero image URL (optional)" type="url" />
            <Input value={heroImageAlt} onChange={(event) => setHeroImageAlt(event.target.value)} placeholder="Hero image alt text" maxLength={180} />
            <Input value={citySlug} onChange={(event) => setCitySlug(event.target.value)} placeholder="City slug (optional)" />
            <Input value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="City name (optional)" />
            <Input value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} placeholder="Meta title (optional)" maxLength={180} />
            <Input value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} placeholder="Meta description (optional)" maxLength={320} />
            <Input value={readTime} onChange={(event) => setReadTime(event.target.value)} placeholder="Read time minutes" type="number" min={1} max={120} />
            <Input value={featuredOrder} onChange={(event) => setFeaturedOrder(event.target.value)} placeholder="Featured order" type="number" min={0} max={200} />
            <Input value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} placeholder="Publish date" type="datetime-local" />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </Button>
        </form>

        {response && (
          <div className="mt-4 border rounded-md p-3 text-sm">
            <div className="font-medium mb-2">Publish Result</div>
            {response.success ? (
              <div className="space-y-1">
                <div className="flex gap-2 flex-wrap">
                  <Badge>{response.idempotent ? 'Idempotent Replay' : 'Published'}</Badge>
                  {response.mode && <Badge variant="secondary">mode: {response.mode}</Badge>}
                </div>
                {response.path && <div>Path: {response.path}</div>}
                {response.commitSha && <div>Commit: {response.commitSha}</div>}
                {response.idempotencyKey && <div>Idempotency Key: {response.idempotencyKey}</div>}
                {response.contentHash && <div>Content Hash: {response.contentHash}</div>}
                {response.rollback?.existed && (
                  <div>
                    Rollback metadata available
                    {response.rollback.backupPath ? ` (backup: ${response.rollback.backupPath})` : ''}
                    {response.rollback.previousCommitSha ? ` (previous commit: ${response.rollback.previousCommitSha})` : ''}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1 text-destructive">
                <div>{response.error || 'Publish failed'}</div>
                {response.details && <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(response.details, null, 2)}</pre>}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
