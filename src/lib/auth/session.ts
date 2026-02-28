import crypto from 'crypto';
import type { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const OWNER_SESSION_COOKIE = 'owner_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function sign(value: string): string {
  return crypto.createHmac('sha256', env.SESSION_SECRET).update(value).digest('hex');
}

export function createSessionToken() {
  const payload = `owner:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  return sign(payload) === sig;
}

export function setOwnerSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(OWNER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearOwnerSessionCookie(res: NextResponse) {
  res.cookies.set(OWNER_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

export function isOwnerAuthenticatedRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(OWNER_SESSION_COOKIE)?.value);
}
