import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Star, ClipboardList, Heart } from '@/lib/icons';
import { getAdminUserById, updateUserRole, updateUserVerification } from '@/app/actions/admin-users';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface UserDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  type MembershipRequestRow = (typeof user.membershipRequests)[number];
  type ReviewRow = (typeof user.reviews)[number];
  type FavoriteRow = (typeof user.favorites)[number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.users.details.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.users.details.subtitle')}</p>
        </div>
        <Link href={`/${lang}/admin/users`}>
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('admin.users.details.back_to_users')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.displayName || t('admin.users.unnamed_user')}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{user.role.replace('_', ' ')}</Badge>
            <Badge variant={user.isVerified ? 'default' : 'secondary'}>
              {user.isVerified ? t('admin.common.verified') : t('admin.common.unverified')}
            </Badge>
            {user.managedClub && <Badge>{t('admin.users.manages')} {user.managedClub.name}</Badge>}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <form action={updateUserVerification}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="isVerified" value={String(!user.isVerified)} />
              <Button type="submit" variant="secondary">
                {user.isVerified ? t('admin.users.set_unverified') : t('admin.users.set_verified')}
              </Button>
            </form>

            <form action={updateUserRole} className="flex gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <select
                name="role"
                defaultValue={user.role}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="USER">{t('admin.users.roles.user')}</option>
                <option value="CLUB_ADMIN">{t('admin.users.roles.club_admin')}</option>
                <option value="ADMIN">{t('admin.users.roles.admin')}</option>
              </select>
              <Button type="submit">{t('admin.users.update_role')}</Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              {t('admin.users.requests')} ({user._count.membershipRequests})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.membershipRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.users.no_requests')}</p>
            ) : (
              user.membershipRequests.map((request: MembershipRequestRow) => (
                <div key={request.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{request.club.name}</div>
                  <div className="text-muted-foreground">{request.status}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" />
              {t('admin.users.reviews')} ({user._count.reviews})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.users.no_reviews')}</p>
            ) : (
              user.reviews.map((review: ReviewRow) => (
                <div key={review.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{review.club.name}</div>
                  <div className="text-muted-foreground">{review.rating}/5</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4" />
              {t('admin.users.favorites')} ({user._count.favorites})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.users.no_favorites')}</p>
            ) : (
              user.favorites.map((favorite: FavoriteRow) => (
                <div key={favorite.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{favorite.club.name}</div>
                  <div className="text-muted-foreground">{favorite.club.isVerified ? t('admin.users.verified_club') : t('admin.users.unverified_club')}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
