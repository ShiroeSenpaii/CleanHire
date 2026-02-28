import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, setOwnerSessionCookie } from '@/lib/auth/session';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  const { passcode } = await req.json();
  if (passcode !== env.OWNER_PASSCODE) {
    return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  setOwnerSessionCookie(res, createSessionToken());
  return res;
}
