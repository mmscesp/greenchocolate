import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUserProfile } from '@/app/actions/users';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { User, 
Settings, 
Shield, 
Heart, 
Star, 
ClipboardList,
ArrowRight,
Clock } from '@/lib/icons';

export const dynamic = 'force-dynamic';

interface AccountPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const userProfile = await getCurrentUserProfile();

  const formatText = (key: string, values: Record<string, string | number>) => {
    let message = t(key);

    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{{${name}}}`, String(value));
    }

    return message;
  };

  if (!userProfile) {
    redirect(`/${lang}/account/login`);
  }

  const menuItems = [
    {
      title: t('user.my_profile'),
      description: t('account.menu.profile_desc'),
      href: `/${lang}/profile`,
      icon: User,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: t('user.favorite_clubs'),
      description: t('account.menu.favorites_desc'),
      href: `/${lang}/profile/favorites`,
      icon: Heart,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: t('user.my_reviews'),
      description: t('account.menu.reviews_desc'),
      href: `/${lang}/profile/reviews`,
      icon: Star,
      color: 'bg-brand/10 text-brand',
    },
    {
      title: t('account.menu.membership_requests'),
      description: t('account.menu.requests_desc'),
      href: `/${lang}/account/requests`,
      icon: ClipboardList,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: t('account.menu.account_settings'),
      description: t('account.menu.settings_desc'),
      href: `/${lang}/profile/settings`,
      icon: Settings,
      color: 'bg-gray-100 text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-24 md:pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {formatText('account.welcome', { name: userProfile.displayName || t('user.fallback.name') })}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('account.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 capitalize">
              {formatText('account.role_account', { role: userProfile.role.toLowerCase().replace('_', ' ') })}
            </span>
          </div>
          {userProfile.lastActiveAt && (
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatText('account.last_active', {
                date: new Date(userProfile.lastActiveAt).toLocaleDateString(),
                time: new Date(userProfile.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              })}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">{t('account.stats.saved_clubs')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">{t('account.stats.reviews_written')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">2</p>
                <p className="text-sm text-muted-foreground">{t('account.stats.active_requests')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Club Admin Section */}
        {(userProfile.role === 'CLUB_ADMIN' || userProfile.role === 'ADMIN') && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('account.club_management.title')}</h2>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  {t('account.club_management.panel_title')}
                </CardTitle>
                <CardDescription>
                  {t('account.club_management.panel_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/${lang}/club-panel/dashboard`}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    {t('account.club_management.access_dashboard')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
