import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { hashToken } from '@/lib/auth/token';
import { fail, ok } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    if (!token) return fail('Missing token', 400);
    const hire = await airtableClient.getHireByTokenHash(hashToken(token));
    if (!hire) return fail('Invalid token', 404);
    if (new Date(hire.tokenExpiresAt).getTime() < Date.now()) return fail('Token expired', 401);
    const items = await airtableClient.listHireItems(hire.id);
    return ok({ hire, items });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
