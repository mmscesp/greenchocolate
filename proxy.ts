// Next.js Proxy for Session Management, Route Protection & i18n
// Supabase Auth Integration + Locale Detection
// Updated to use modern @supabase/ssr cookie API (setAll/getAll pattern)

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
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
      // Determine which login page to use
      const loginPath = pathname.startsWith('/club-panel') 
        ? '/club-panel/login' 
        : '/account/login';
        
      const loginUrl = new URL(`/${pathnameLocale}${loginPath}`, request.url);
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
  const authRoutes = ['/club-panel/login', '/club-panel/signup', '/account/login', '/account/register'];
  if (authRoutes.some(route => pathname.startsWith(route)) && user) {
    // Get user role to redirect appropriately
    const { data: profile } = await supabase
      .from('Profile')
      .select('role')
      .eq('authId', user.id)
      .single();

    const role = profile?.role || 'USER';
    let landingPage = `/${pathnameLocale}`;
    
    if (role === 'CLUB_ADMIN') {
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
