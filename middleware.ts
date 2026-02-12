import { type NextRequest } from 'next/server';
import { proxy } from './proxy';

/**
 * Next.js Middleware
 * Activates route protection, session management, and i18n
 * 
 * This file wires up the proxy.ts implementation to actually run
 * as Next.js middleware on every request.
 */
export async function middleware(request: NextRequest) {
  return proxy(request);
}

/**
 * Middleware Configuration
 * Matches all routes except static assets and API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
