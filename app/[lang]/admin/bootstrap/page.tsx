import { prisma } from '@/lib/prisma';
import { getServerEnv } from '@/lib/env';
import { bootstrapInitialAdminProfileAction } from '@/app/actions/applications';

interface AdminBootstrapPageProps {
  params: Promise<{ lang: string }>;
}

const bootstrapCopy = {
  en: {
    badge: 'Admin Bootstrap',
    title: 'Create the first admin profile',
    description:
      'This page is only for the first admin bootstrap. Create the auth user manually in Supabase first, then complete the matching Profile as ADMIN here.',
    adminCount: 'Current admin count',
    configured: 'Bootstrap env configured',
    locale: 'Locale',
    yes: 'yes',
    no: 'no',
    locked: 'Bootstrap is locked because an admin already exists.',
    missing:
      'Missing ADMIN_BOOTSTRAP_SECRET or SUPABASE_SERVICE_ROLE_KEY. Configure both server env vars before using this page.',
    email: 'Admin email',
    secret: 'Bootstrap secret',
    submit: 'Create admin profile',
  },
  es: {
    badge: 'Bootstrap admin',
    title: 'Crear el primer perfil admin',
    description:
      'Esta pagina solo sirve para el primer bootstrap admin. Crea antes el usuario de autenticacion en Supabase y despues completa aqui el Profile correspondiente como ADMIN.',
    adminCount: 'Numero actual de admins',
    configured: 'Entorno de bootstrap configurado',
    locale: 'Idioma',
    yes: 'si',
    no: 'no',
    locked: 'El bootstrap esta bloqueado porque ya existe un admin.',
    missing:
      'Falta ADMIN_BOOTSTRAP_SECRET o SUPABASE_SERVICE_ROLE_KEY. Configura ambas variables antes de usar esta pagina.',
    email: 'Email del admin',
    secret: 'Secreto de bootstrap',
    submit: 'Crear perfil admin',
  },
  fr: {
    badge: 'Bootstrap admin',
    title: 'Creer le premier profil admin',
    description:
      'Cette page sert uniquement au premier bootstrap admin. Creez d abord l utilisateur d authentification dans Supabase, puis completez ici le Profile correspondant en ADMIN.',
    adminCount: 'Nombre actuel d admins',
    configured: 'Environnement de bootstrap configure',
    locale: 'Langue',
    yes: 'oui',
    no: 'non',
    locked: 'Le bootstrap est verrouille car un admin existe deja.',
    missing:
      'ADMIN_BOOTSTRAP_SECRET ou SUPABASE_SERVICE_ROLE_KEY manque. Configurez ces deux variables avant d utiliser cette page.',
    email: 'Email admin',
    secret: 'Secret de bootstrap',
    submit: 'Creer le profil admin',
  },
  de: {
    badge: 'Admin-Bootstrap',
    title: 'Erstes Admin-Profil erstellen',
    description:
      'Diese Seite ist nur fur den ersten Admin-Bootstrap gedacht. Erstelle zuerst den Auth-User in Supabase und vervollstandige danach hier das passende Profile als ADMIN.',
    adminCount: 'Aktuelle Anzahl Admins',
    configured: 'Bootstrap-Umgebung konfiguriert',
    locale: 'Sprache',
    yes: 'ja',
    no: 'nein',
    locked: 'Der Bootstrap ist gesperrt, weil bereits ein Admin existiert.',
    missing:
      'ADMIN_BOOTSTRAP_SECRET oder SUPABASE_SERVICE_ROLE_KEY fehlt. Konfiguriere beide Server-Variablen, bevor du diese Seite nutzt.',
    email: 'Admin-E-Mail',
    secret: 'Bootstrap-Secret',
    submit: 'Admin-Profil erstellen',
  },
} as const;

export default async function AdminBootstrapPage({ params }: AdminBootstrapPageProps) {
  const { lang } = await params;
  const copy = bootstrapCopy[lang as keyof typeof bootstrapCopy] ?? bootstrapCopy.en;
  const adminCount = await prisma.profile.count({ where: { role: 'ADMIN' } });
  const env = getServerEnv();
  const bootstrapConfigured = Boolean(env.ADMIN_BOOTSTRAP_SECRET && env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 px-4 py-20">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{copy.badge}</p>
          <h1 className="mt-3 text-3xl font-bold">{copy.title}</h1>
          <p className="mt-3 text-sm text-slate-600">
            {copy.description}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>{copy.adminCount}: <strong>{adminCount}</strong></p>
          <p>{copy.configured}: <strong>{bootstrapConfigured ? copy.yes : copy.no}</strong></p>
          <p>{copy.locale}: <strong>{lang}</strong></p>
        </div>

        {adminCount > 0 ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            {copy.locked}
          </div>
        ) : !bootstrapConfigured ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
            {copy.missing}
          </div>
        ) : (
          <form action={bootstrapInitialAdminProfileAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                {copy.email}
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
                {copy.secret}
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
              {copy.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
