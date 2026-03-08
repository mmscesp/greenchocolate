import { prisma } from '@/lib/prisma';
import { getServerEnv } from '@/lib/env';
import { bootstrapInitialAdminProfileAction } from '@/app/actions/applications';

interface AdminBootstrapPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminBootstrapPage({ params }: AdminBootstrapPageProps) {
  const { lang } = await params;
  const adminCount = await prisma.profile.count({ where: { role: 'ADMIN' } });
  const env = getServerEnv();
  const bootstrapConfigured = Boolean(env.ADMIN_BOOTSTRAP_SECRET && env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 px-4 py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Admin Bootstrap</p>
          <h1 className="mt-3 text-3xl font-bold">Create the first admin profile</h1>
          <p className="mt-3 text-sm text-slate-600">
            This page is only for the first admin bootstrap. Create the auth user manually in Supabase first, then
            complete the matching `Profile` as `ADMIN` here.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>Current admin count: <strong>{adminCount}</strong></p>
          <p>Bootstrap env configured: <strong>{bootstrapConfigured ? 'yes' : 'no'}</strong></p>
          <p>Locale: <strong>{lang}</strong></p>
        </div>

        {adminCount > 0 ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Bootstrap is locked because an admin already exists.
          </div>
        ) : !bootstrapConfigured ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
            Missing `ADMIN_BOOTSTRAP_SECRET` or `SUPABASE_SERVICE_ROLE_KEY`. Configure both server env vars before
            using this page.
          </div>
        ) : (
          <form action={bootstrapInitialAdminProfileAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Admin email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="secret" className="mb-2 block text-sm font-medium text-slate-700">
                Bootstrap secret
              </label>
              <input
                id="secret"
                name="secret"
                type="password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Create admin profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
