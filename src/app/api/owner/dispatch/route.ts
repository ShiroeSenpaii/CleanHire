import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { fail, ok } from '@/lib/http';
import { sendSms } from '@/lib/services/twilio';

export async function POST(req: NextRequest) {
  try {
    requireOwnerAuth();
    const { hireId, companyId, phone, message } = await req.json();
    const body = `${message}\nReply YES or NO.`;
    const sms = await sendSms(phone, body);
    await airtableClient.updateHire(hireId, { dispatchStatus: 'Awaiting response' });
    await airtableClient.logMessage({ companyId, hireId, direction: 'Outbound', channel: 'SMS', type: 'DISPATCH_REQUEST', body, toPhone: phone, twilioSid: sms.sid, createdAt: new Date().toISOString() });
    return ok({ success: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
