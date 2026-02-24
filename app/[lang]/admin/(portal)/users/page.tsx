import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ChevronLeft, ChevronRight, Users } from '@/lib/icons';
import { getAdminUsers, updateUserRole, updateUserVerification } from '@/app/actions/admin-users';

interface UsersPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminUsersPage({ params, searchParams }: UsersPageProps) {
  const { lang } = await params;
  const query = await searchParams;

  const q = getString(query.q);
  const role = getString(query.role, 'ALL') as 'ALL' | 'USER' | 'CLUB_ADMIN' | 'ADMIN';
  const page = Number(getString(query.page, '1')) || 1;

  const data = await getAdminUsers({ query: q, role, page, pageSize: 20 });
  type UserRow = (typeof data.users)[number];

  const buildUrl = (nextPage: number) => {
    const paramsObj = new URLSearchParams();
    if (q) paramsObj.set('q', q);
    if (role !== 'ALL') paramsObj.set('role', role);
    paramsObj.set('page', String(nextPage));
    return `/${lang}/admin/users?${paramsObj.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform users, roles, and verification status.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3" action={`/${lang}/admin/users`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="q" defaultValue={q} placeholder="Search by email or display name" className="pl-9" />
            </div>
            <select
              name="role"
              defaultValue={role}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All roles</option>
              <option value="USER">User</option>
              <option value="CLUB_ADMIN">Club Admin</option>
              <option value="ADMIN">Admin</option>
            </select>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({data.total})</CardTitle>
          <CardDescription>Page {data.page} of {Math.max(1, data.totalPages)}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2" />
              No users found for this filter.
            </div>
          ) : (
            <div className="space-y-4">
              {data.users.map((user: UserRow) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || ''} />
                        <AvatarFallback>{(user.displayName || user.email).charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{user.displayName || 'Unnamed user'}</div>
                        <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{user.role.replace('_', ' ')}</Badge>
                          <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <Link href={`/${lang}/admin/users/${user.id}`}>
                        <Button variant="outline" size="sm">Details</Button>
                      </Link>

                      <form action={updateUserVerification}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="isVerified" value={String(!user.isVerified)} />
                        <Button type="submit" size="sm" variant="outline">
                          {user.isVerified ? 'Mark Unverified' : 'Mark Verified'}
                        </Button>
                      </form>

                      <form action={updateUserRole}>
                        <input type="hidden" name="userId" value={user.id} />
                        <select
                          name="role"
                          defaultValue={user.role}
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          <option value="USER">User</option>
                          <option value="CLUB_ADMIN">Club Admin</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <Button type="submit" size="sm" className="ml-2">Update Role</Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button asChild variant="outline" size="sm" disabled={data.page <= 1}>
              <Link href={buildUrl(Math.max(1, data.page - 1))}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">Page {data.page} of {Math.max(1, data.totalPages)}</span>
            <Button asChild variant="outline" size="sm" disabled={data.page >= data.totalPages}>
              <Link href={buildUrl(Math.min(data.totalPages || 1, data.page + 1))}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
