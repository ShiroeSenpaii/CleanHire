import { NextRequest } from 'next/server';
import { createOwnerSession } from '@/lib/auth/session';
import { env } from '@/lib/env';
import { fail, ok } from '@/lib/http';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== env.OWNER_PASSWORD) return fail('Invalid password', 401);
  createOwnerSession();
  return ok({ success: true });
}
