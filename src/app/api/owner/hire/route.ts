import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { ok, fail } from '@/lib/http';
import { createHireAndInvite } from '@/lib/services/onboarding';

export async function GET() {
  try {
    requireOwnerAuth();
    return ok({ hires: await airtableClient.listHires() });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    requireOwnerAuth();
    const body = await req.json();
    const result = await createHireAndInvite(body);
    return ok(result, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
