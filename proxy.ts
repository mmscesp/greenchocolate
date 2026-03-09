// Next.js Proxy for Session Management, Route Protection & i18n
// Supabase Auth Integration + Locale Detection
// Updated to use modern @supabase/ssr cookie API (setAll/getAll pattern)

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n, isLocale } from '@/lib/i18n-config';

function getLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = [...i18n.locales];
  
  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

function getLocaleFromPathname(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && isLocale(firstSegment)) {
    return firstSegment;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an API route - skip locale handling for API
  if (pathname.startsWith('/api')) {
    return NextResponse.next({
      request: { headers: request.headers },
    });
  }

  // Check if there is any supported locale in the pathname
  const pathnameLocale = getLocaleFromPathname(pathname);
  const pathnameIsMissingLocale = !pathnameLocale;
  const firstSegment = pathname.split('/')[1] ?? '';
  const hasLocaleLikePrefix = /^[a-z]{2}$/i.test(firstSegment);

  // Let invalid locale prefixes fall through to the App Router so [lang]/layout can 404 them.
  if (pathnameIsMissingLocale && hasLocaleLikePrefix) {
    return NextResponse.next({
      request: { headers: request.headers },
    });
  }

  // Redirect if there is no locale (and it's not an API/static route)
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  const localizedPathname = pathnameLocale
    ? pathname.replace(new RegExp(`^/${pathnameLocale}`), '') || '/'
    : pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-scm-locale', pathnameLocale);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes (require authentication)
  const protectedRoutes = [
    '/profile',
    '/account/requests',
  ];

  // Role-scoped routes
  const adminRoutes = ['/admin'];
  const clubPanelRoutes = ['/club-panel/dashboard'];
  const adminAuthRoutes = ['/admin/login', '/admin/bootstrap'];

  const isProtected = protectedRoutes.some(route => localizedPathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => localizedPathname.startsWith(route));
  const isClubPanelRoute = clubPanelRoutes.some(route => localizedPathname.startsWith(route));
  const isAdminAuthRoute = adminAuthRoutes.some(route => localizedPathname.startsWith(route));

  // Protect authenticated routes
  const shouldProtectRoute =
    isProtected ||
    isClubPanelRoute ||
    (isAdminRoute && !isAdminAuthRoute);

  if (shouldProtectRoute) {
    if (!user) {
      // Determine which login page to use
      const loginPath = localizedPathname.startsWith('/admin')
        ? '/admin/login'
        : localizedPathname.startsWith('/club-panel') 
        ? '/club-panel/login' 
        : '/account/login';
        
      const loginUrl = new URL(`/${pathnameLocale}${loginPath}`, request.url);
      loginUrl.searchParams.set('redirect', localizedPathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin role for admin routes
    if (isAdminRoute || isClubPanelRoute) {
      const { data: profile } = await supabase
        .from('Profile')
        .select('role')
        .eq('authId', user.id)
        .single();

      // Strict ADMIN-only for /admin/**
      if (isAdminRoute && (!profile || profile.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL(`/${pathnameLocale}`, request.url));
      }

      // CLUB_ADMIN or ADMIN for /club-panel/**
      if (
        isClubPanelRoute &&
        (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN'))
      ) {
        return NextResponse.redirect(new URL(`/${pathnameLocale}`, request.url));
      }
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/club-panel/login', '/club-panel/signup', '/account/login', '/account/register', '/admin/login', '/admin/bootstrap'];
  if (authRoutes.some(route => localizedPathname.startsWith(route)) && user) {
    // Get user role to redirect appropriately
    const { data: profile } = await supabase
      .from('Profile')
      .select('role')
      .eq('authId', user.id)
      .single();

    const role = profile?.role || 'USER';
    let landingPage = `/${pathnameLocale}`;
    
    if (localizedPathname.startsWith('/admin/login')) {
      landingPage = role === 'ADMIN' ? `/${pathnameLocale}/admin` : `/${pathnameLocale}`;
    } else if (role === 'CLUB_ADMIN') {
      landingPage = `/${pathnameLocale}/club-panel/dashboard`;
    } else if (role === 'ADMIN') {
      landingPage = `/${pathnameLocale}/admin`;
    }

    return NextResponse.redirect(new URL(landingPage, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov|ogg)$).*)',
  ],
};


