import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Star, ClipboardList, Heart } from 'lucide-react';
import { getAdminUserById, updateUserRole, updateUserVerification } from '@/app/actions/admin-users';

interface UserDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { lang, id } = await params;
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground mt-1">Inspect profile, activity, and account controls.</p>
        </div>
        <Link href={`/${lang}/admin/users`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to users
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.displayName || 'Unnamed user'}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{user.role.replace('_', ' ')}</Badge>
            <Badge variant={user.isVerified ? 'default' : 'secondary'}>
              {user.isVerified ? 'Verified' : 'Unverified'}
            </Badge>
            {user.managedClub && <Badge>Manages {user.managedClub.name}</Badge>}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <form action={updateUserVerification}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="isVerified" value={String(!user.isVerified)} />
              <Button type="submit" variant="outline">
                {user.isVerified ? 'Set Unverified' : 'Set Verified'}
              </Button>
            </form>

            <form action={updateUserRole} className="flex gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <select
                name="role"
                defaultValue={user.role}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="USER">User</option>
                <option value="CLUB_ADMIN">Club Admin</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button type="submit">Update Role</Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              Requests ({user._count.membershipRequests})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.membershipRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests yet.</p>
            ) : (
              user.membershipRequests.map((request) => (
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
              Reviews ({user._count.reviews})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              user.reviews.map((review) => (
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
              Favorites ({user._count.favorites})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorites yet.</p>
            ) : (
              user.favorites.map((favorite) => (
                <div key={favorite.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{favorite.club.name}</div>
                  <div className="text-muted-foreground">{favorite.club.isVerified ? 'Verified club' : 'Unverified club'}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
