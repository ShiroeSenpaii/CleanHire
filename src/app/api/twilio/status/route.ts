import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    return ok({ sid: form.get('MessageSid'), status: form.get('MessageStatus') });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
