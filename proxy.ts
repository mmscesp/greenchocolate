// Next.js Proxy for Session Management & Route Protection
// Supabase Auth Integration
// MIGRATED from middleware.ts to proxy.ts for Next.js 16

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

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

  // Get pathname
  const { pathname } = request.nextUrl;

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
      const loginUrl = new URL('/club-panel/login', request.url);
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
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/club-panel/login', '/club-panel/signup'];
  if (authRoutes.some(route => pathname.startsWith(route)) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
