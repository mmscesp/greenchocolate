// Next.js Proxy for Session Management, Route Protection & i18n
// Supabase Auth Integration + Locale Detection

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n } from '@/lib/i18n-config';

function getLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as typeof i18n.locales[number])) {
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
  if (firstSegment && i18n.locales.includes(firstSegment as typeof i18n.locales[number])) {
    return firstSegment;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const { pathname } = request.nextUrl;

  // Check if this is an API route - skip locale handling for API
  if (pathname.startsWith('/api')) {
    return response;
  }

  // Check if there is any supported locale in the pathname
  const pathnameLocale = getLocaleFromPathname(pathname);
  const pathnameIsMissingLocale = !pathnameLocale;

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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes (require authentication)
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/my-requests',
  ];

  // Admin routes (require ADMIN or CLUB_ADMIN role)
  const adminRoutes = [
    '/admin',
    '/club-panel/dashboard',
  ];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdmin = adminRoutes.some(route => pathname.startsWith(route));

  // Protect authenticated routes
  if (isProtected || isAdmin) {
    if (!user) {
      // Redirect to login with return URL
      const loginUrl = new URL(`/${pathnameLocale}/club-panel/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin role for admin routes
    if (isAdmin) {
      const { data: profile } = await supabase
        .from('Profile')
        .select('role')
        .eq('authId', user.id)
        .single();

      if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'CLUB_ADMIN')) {
        // Redirect non-admins to home
        return NextResponse.redirect(new URL(`/${pathnameLocale}`, request.url));
      }
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/club-panel/login', '/club-panel/signup'];
  if (authRoutes.some(route => pathname.startsWith(route)) && user) {
    return NextResponse.redirect(new URL(`/${pathnameLocale}/dashboard`, request.url));
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
