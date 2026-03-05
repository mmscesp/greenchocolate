import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface AdminSettingsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.settings.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.settings.moderation.title')}</CardTitle>
          <CardDescription>{t('admin.settings.moderation.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('admin.settings.strict_verification')}</Label>
              <p className="text-xs text-muted-foreground">{t('admin.settings.strict_verification_desc')}</p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('admin.settings.audit_logging')}</Label>
              <p className="text-xs text-muted-foreground">{t('admin.settings.audit_logging_desc')}</p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('admin.settings.emergency_freeze')}</Label>
              <p className="text-xs text-muted-foreground">{t('admin.settings.emergency_freeze_desc')}</p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
