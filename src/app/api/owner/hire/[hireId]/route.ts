import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { fail, ok } from '@/lib/http';

export async function GET(_: Request, { params }: { params: { hireId: string } }) {
  try {
    requireOwnerAuth();
    const hire = await airtableClient.getHireById(params.hireId);
    if (!hire) return fail('Not found', 404);
    const items = await airtableClient.listHireItems(params.hireId);
    const messages = await airtableClient.listMessages(params.hireId);
    return ok({ hire, items, messages });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed', 401);
  }
}
