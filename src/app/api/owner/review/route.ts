import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { env } from '@/lib/env';
import { fail, ok } from '@/lib/http';
import { generateMagicToken, hashToken } from '@/lib/auth/token';
import { sendSms } from '@/lib/services/twilio';

export async function POST(req: NextRequest) {
  try {
    requireOwnerAuth();
    const { hireId, hireItemId, action, reason, phone, companyId, itemName } = await req.json();
    const status = action === 'approve' ? 'Approved' : 'Rejected';
    await airtableClient.updateHireItem(hireItemId, { status, reviewedAt: new Date().toISOString(), rejectionReason: reason });

    if (status === 'Rejected') {
      const token = generateMagicToken();
      await airtableClient.updateHire(hireId, { magicTokenHash: hashToken(token), status: 'Missing' });
      const link = `${env.NEXT_PUBLIC_APP_URL}/hire/${token}`;
      const body = `Please re-upload ${itemName}. Reason: ${reason}. Link: ${link}`;
      const sms = await sendSms(phone, body);
      await airtableClient.logMessage({ companyId, hireId, direction: 'Outbound', channel: 'SMS', type: 'REJECT_NOTICE', body, toPhone: phone, twilioSid: sms.sid, createdAt: new Date().toISOString() });
    }

    return ok({ success: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
