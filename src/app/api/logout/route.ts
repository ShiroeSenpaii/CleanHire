import { NextResponse } from 'next/server';
import { clearOwnerSessionCookie } from '@/lib/auth/session';

export async function POST() {
  const res = NextResponse.json({ success: true });
  clearOwnerSessionCookie(res);
  return res;
}
