import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminArticleIndex } from '@/app/actions/admin-content';
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
  const t = (key: string) => dictionary[key] || key;
  const articles = await getAdminArticleIndex();
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
          <CardTitle>{t('admin.content.articles.list_title')} ({articles.length})</CardTitle>
          <CardDescription>{t('admin.content.articles.list_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {articles.map((article: ArticleRow) => (
              <div key={article.id} className="border rounded-md p-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-muted-foreground">/{article.slug}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{article.category}</Badge>
                    <Badge variant="secondary">{article.readTime} {t('admin.content.articles.min_read')}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PublishArticleForm />
    </div>
  );
}
