import AdminShell from '../AdminShell';
import { requireAdminSession } from '@/lib/security/admin-guard';

interface AdminPortalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminPortalLayout({
  children,
  params,
}: AdminPortalLayoutProps) {
  const { lang } = await params;
  const admin = await requireAdminSession(lang);

  return (
    <AdminShell
      lang={lang}
      adminInfo={{
        displayName: admin.displayName,
        email: admin.email,
        avatarUrl: admin.avatarUrl,
      }}
    >
      {children}
    </AdminShell>
  );
}
