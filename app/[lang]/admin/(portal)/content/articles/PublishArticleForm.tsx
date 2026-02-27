'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
  const formatText = (key: string, values: Record<string, string>) => {
    let message = t(key);

    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{{${name}}}`, value);
    }

    return message;
  };

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<'legal' | 'etiquette' | 'harm-reduction' | 'culture'>('culture');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState(() => t('admin.content.articles.publish.author_default'));
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
        error: error instanceof Error ? error.message : t('admin.content.articles.publish.error_request_failed'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.content.articles.publish.title')}</CardTitle>
        <CardDescription>
          {t('admin.content.articles.publish.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.article_title')} required minLength={5} maxLength={180} />
            <Input
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              placeholder={suggestedSlug || t('admin.content.articles.publish.placeholders.article_slug')}
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              title={t('admin.content.articles.publish.slug_title')}
            />
          </div>

          <Textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.seo_excerpt')} required minLength={20} maxLength={350} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as 'legal' | 'etiquette' | 'harm-reduction' | 'culture')}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="culture">{t('admin.content.articles.publish.categories.culture')}</option>
              <option value="legal">{t('admin.content.articles.publish.categories.legal')}</option>
              <option value="etiquette">{t('admin.content.articles.publish.categories.etiquette')}</option>
              <option value="harm-reduction">{t('admin.content.articles.publish.categories.harm_reduction')}</option>
            </select>
            <Input value={authorName} onChange={(event) => setAuthorName(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.author_name')} required minLength={2} maxLength={120} />
          </div>

          <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.mdx_content')} required minLength={120} className="min-h-[220px]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.tags')} />
            <Input value={authorBio} onChange={(event) => setAuthorBio(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.author_bio')} maxLength={320} />
            <Input value={heroImage} onChange={(event) => setHeroImage(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.hero_image_url')} type="url" />
            <Input value={heroImageAlt} onChange={(event) => setHeroImageAlt(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.hero_image_alt')} maxLength={180} />
            <Input value={citySlug} onChange={(event) => setCitySlug(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.city_slug')} />
            <Input value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.city_name')} />
            <Input value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.meta_title')} maxLength={180} />
            <Input value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.meta_description')} maxLength={320} />
            <Input value={readTime} onChange={(event) => setReadTime(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.read_time_minutes')} type="number" min={1} max={120} />
            <Input value={featuredOrder} onChange={(event) => setFeaturedOrder(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.featured_order')} type="number" min={0} max={200} />
            <Input value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} placeholder={t('admin.content.articles.publish.placeholders.publish_date')} type="datetime-local" />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('admin.content.articles.publish.publishing') : t('admin.content.articles.publish.publish_article')}
          </Button>
        </form>

        {response && (
          <div className="mt-4 border rounded-md p-3 text-sm">
            <div className="font-medium mb-2">{t('admin.content.articles.publish.result_title')}</div>
            {response.success ? (
              <div className="space-y-1">
                <div className="flex gap-2 flex-wrap">
                  <Badge>{response.idempotent ? t('admin.content.articles.publish.result.idempotent_replay') : t('admin.content.articles.publish.result.published')}</Badge>
                  {response.mode && (
                    <Badge variant="secondary">
                      {formatText('admin.content.articles.publish.result.mode', { mode: response.mode })}
                    </Badge>
                  )}
                </div>
                {response.path && <div>{formatText('admin.content.articles.publish.result.path', { path: response.path })}</div>}
                {response.commitSha && <div>{formatText('admin.content.articles.publish.result.commit', { commit: response.commitSha })}</div>}
                {response.idempotencyKey && <div>{formatText('admin.content.articles.publish.result.idempotency_key', { key: response.idempotencyKey })}</div>}
                {response.contentHash && <div>{formatText('admin.content.articles.publish.result.content_hash', { hash: response.contentHash })}</div>}
                {response.rollback?.existed && (
                  <div>
                    {t('admin.content.articles.publish.result.rollback_available')}
                    {response.rollback.backupPath ? ` (${formatText('admin.content.articles.publish.result.backup', { backup: response.rollback.backupPath })})` : ''}
                    {response.rollback.previousCommitSha ? ` (${formatText('admin.content.articles.publish.result.previous_commit', { commit: response.rollback.previousCommitSha })})` : ''}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1 text-destructive">
                <div>{response.error || t('admin.content.articles.publish.error_publish_failed')}</div>
                {response.details && <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(response.details, null, 2)}</pre>}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
