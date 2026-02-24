import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminArticleIndex } from '@/app/actions/admin-content';
import PublishArticleForm from './PublishArticleForm';

export const dynamic = 'force-dynamic';

export default async function AdminContentArticlesPage() {
  const articles = await getAdminArticleIndex();
  type ArticleRow = (typeof articles)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content - Articles</h1>
        <p className="text-muted-foreground mt-1">
          Public editorial index (file-backed MDX). Publish workflow integration is ready for admin wiring.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles ({articles.length})</CardTitle>
          <CardDescription>Latest indexed articles from content artifacts.</CardDescription>
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
                    <Badge variant="secondary">{article.readTime} min read</Badge>
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
