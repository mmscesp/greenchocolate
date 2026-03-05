import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';

interface AuditLogsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminAuditLogsPage({ params, searchParams }: AuditLogsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  const query = await searchParams;
  const tableName = getString(query.table);

  const logs = await prisma.auditLog.findMany({
    where: tableName ? { tableName } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const tableNames = await prisma.auditLog.findMany({
    distinct: ['tableName'],
    select: { tableName: true },
    orderBy: { tableName: 'asc' },
  });

  type TableNameRow = (typeof tableNames)[number];
  type AuditLogRow = (typeof logs)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.audit.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.audit.subtitle')}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="flex gap-3 items-center">
            <label className="text-sm text-muted-foreground">{t('admin.audit.filter_by_table')}</label>
            <select name="table" defaultValue={tableName} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">{t('admin.audit.all_tables')}</option>
              {tableNames.map((table: TableNameRow) => (
                <option key={table.tableName} value={table.tableName}>{table.tableName}</option>
              ))}
            </select>
            <button className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm" type="submit">
              {t('admin.common.apply')}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.audit.recent_logs')}</CardTitle>
          <CardDescription>{logs.length} {t('admin.audit.records')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log: AuditLogRow) => (
              <div key={log.id} className="border rounded-md p-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{log.tableName}</Badge>
                    <Badge>{log.operation}</Badge>
                    <span className="text-xs text-muted-foreground">{t('admin.audit.record')}: {log.recordId}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">{t('admin.audit.changed_by')}: {log.changedBy}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
