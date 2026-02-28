import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { fail, ok } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    requireOwnerAuth();
    const companyId = req.nextUrl.searchParams.get('companyId') || '';
    return ok({ faq: await airtableClient.listFaq(companyId) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed', 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    requireOwnerAuth();
    const body = await req.json();
    return ok({ faq: await airtableClient.createFaq(body) }, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
