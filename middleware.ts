import { NextRequest, NextResponse } from 'next/server';
import { OWNER_SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

const protectedPrefixes = ['/hires', '/faq', '/companies', '/admin', '/api/admin'];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get(OWNER_SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) return NextResponse.next();

  if (path.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', path);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/hires/:path*', '/faq/:path*', '/companies/:path*', '/admin/:path*', '/api/admin/:path*']
};
