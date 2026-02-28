import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { fail, ok } from '@/lib/http';

export async function PATCH(req: NextRequest, { params }: { params: { faqId: string } }) {
  try {
    requireOwnerAuth();
    const body = await req.json();
    await airtableClient.updateFaq(params.faqId, body);
    return ok({ success: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
