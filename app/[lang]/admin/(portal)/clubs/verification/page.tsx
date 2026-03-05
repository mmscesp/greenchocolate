import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from '@/lib/icons';
import { getPendingClubVerifications, updateClubFlags } from '@/app/actions/admin-clubs';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface VerificationPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ClubVerificationPage({ params }: VerificationPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const pendingClubs = await getPendingClubVerifications();
  type PendingClubRow = (typeof pendingClubs)[number];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.clubs.verification_queue.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.clubs.verification_queue.subtitle')}</p>
      </div>

      {pendingClubs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500" />
            {t('admin.clubs.verification_queue.empty')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pendingClubs.map((club: PendingClubRow) => (
            <Card key={club.id}>
              <CardHeader>
                <CardTitle className="text-lg">{club.name}</CardTitle>
                <CardDescription>/{club.slug} · {club.city.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{t('admin.clubs.pending_verification')}</Badge>
                  <Badge variant={club.isActive ? 'default' : 'destructive'}>
                    {club.isActive ? t('admin.common.active') : t('admin.common.inactive')}
                  </Badge>
                  <Badge variant="secondary">{club.admins.length} {t('admin.common.admins')}</Badge>
                  <Badge variant="secondary">{club._count.membershipRequests} {t('admin.common.requests')}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  {t('admin.common.contact')}: {club.contactEmail}
                </div>

                <div className="flex gap-2">
                  <Link href={`/${lang}/admin/clubs/${club.id}`}>
                    <Button variant="secondary" size="sm">{t('admin.common.review_details')}</Button>
                  </Link>
                  <form action={updateClubFlags}>
                    <input type="hidden" name="clubId" value={club.id} />
                    <input type="hidden" name="isVerified" value="true" />
                    <Button type="submit" size="sm">{t('admin.common.approve')}</Button>
                  </form>
                  <form action={updateClubFlags}>
                    <input type="hidden" name="clubId" value={club.id} />
                    <input type="hidden" name="isActive" value="false" />
                    <Button type="submit" size="sm" variant="destructive">{t('admin.common.reject')}</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
