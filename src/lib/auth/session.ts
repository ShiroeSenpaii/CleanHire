import crypto from 'crypto';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

const COOKIE = 'cleanops_owner_session';

function sign(value: string): string {
  return crypto.createHmac('sha256', env.SESSION_SECRET).update(value).digest('hex');
}

export function createOwnerSession() {
  const value = `owner:${Date.now()}`;
  const token = `${value}.${sign(value)}`;
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
}

export function clearOwnerSession() {
  cookies().delete(COOKIE);
}

export function isOwnerAuthenticated(): boolean {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  const [value, signature] = token.split('.');
  if (!value || !signature) return false;
  return sign(value) === signature;
}

export function requireOwnerAuth() {
  if (!isOwnerAuthenticated()) {
    throw new Error('UNAUTHORIZED');
  }
}
