import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  const query = await searchParams;
  const tableName = getString(query.table);
  const operation = getString(query.operation);

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(tableName ? { tableName } : {}),
      ...(operation
        ? {
            operation: {
              contains: operation,
              mode: 'insensitive',
            },
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  const actorIds = Array.from(new Set(logs.map((log) => log.changedBy)));
  const actors = actorIds.length
    ? await prisma.profile.findMany({
        where: {
          authId: {
            in: actorIds,
          },
        },
        select: {
          authId: true,
          email: true,
          displayName: true,
        },
      })
    : [];

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
          <form className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center">
            <label className="text-sm text-muted-foreground">{t('admin.audit.filter_by_table')}</label>
            <select name="table" defaultValue={tableName} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">{t('admin.audit.all_tables')}</option>
              {tableNames.map((table: TableNameRow) => (
                <option key={table.tableName} value={table.tableName}>{table.tableName}</option>
              ))}
            </select>
            <Input
              name="operation"
              defaultValue={operation}
              placeholder="Filter by operation name"
            />
            <Button className="h-10 px-4 text-sm" type="submit">
              {t('admin.common.apply')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.audit.recent_logs')}</CardTitle>
          <CardDescription>{logs.length} {t('admin.audit.records')}</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No audit records match the current filters.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log: AuditLogRow) => {
                const actor = actors.find((profile) => profile.authId === log.changedBy);
                const actorLabel = actor?.displayName || actor?.email || log.changedBy;

                return (
                <div key={log.id} className="border rounded-md p-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{log.tableName}</Badge>
                      <Badge>{log.operation}</Badge>
                      <span className="text-xs text-muted-foreground">{t('admin.audit.record')}: {log.recordId}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {t('admin.audit.changed_by')}: {actorLabel}
                    {actorLabel !== log.changedBy ? ` (${log.changedBy})` : ''}
                  </div>
                  <details className="mt-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900/50">
                    <summary className="cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200">
                      View change payload
                    </summary>
                    <pre className="mt-3 whitespace-pre-wrap break-all text-xs text-slate-600 dark:text-slate-300">
                      {JSON.stringify(log.changeData, null, 2)}
                    </pre>
                  </details>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
