import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminArticleIndex } from '@/app/actions/admin-content';
import { getCategoriesWithCounts } from '@/app/actions/articles';
import PublishArticleForm from './PublishArticleForm';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AdminContentArticlesPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminContentArticlesPage({ params }: AdminContentArticlesPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const [articles, categoryCounts] = await Promise.all([
    getAdminArticleIndex(),
    getCategoriesWithCounts(lang as Locale),
  ]);
  type ArticleRow = (typeof articles)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.content.articles.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('admin.content.articles.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content coverage</CardTitle>
          <CardDescription>High-level inventory across the editorial library.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {categoryCounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No article categories indexed yet.</p>
          ) : (
            categoryCounts.map((category) => (
              <Badge key={category.name} variant="secondary">
                {category.name} · {category.count}
              </Badge>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.content.articles.list_title')} ({articles.length})</CardTitle>
          <CardDescription>{t('admin.content.articles.list_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No articles are indexed yet.
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article: ArticleRow) => (
                <div key={article.id} className="border rounded-md p-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-muted-foreground">/{article.slug}</div>
                      <div className="text-sm text-muted-foreground">
                        {article.authorName}
                        {article.cityName ? ` · ${article.cityName}` : ''}
                        {article.publishedAt ? ` · ${new Date(article.publishedAt).toLocaleDateString()}` : ' · Unscheduled'}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{article.category}</Badge>
                      <Badge variant="secondary">{article.readTime} {t('admin.content.articles.min_read')}</Badge>
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PublishArticleForm />
    </div>
  );
}
