import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { fail, ok } from '@/lib/http';
import { respondToFaq } from '@/lib/services/onboarding';
import { sendSms } from '@/lib/services/twilio';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const fromPhone = String(form.get('From') || '');
    const body = String(form.get('Body') || '').trim();

    const hires = await airtableClient.listHires();
    const hire = hires.find((h) => h.phone === fromPhone);
    if (!hire) return ok({ ignored: true });

    const company = await airtableClient.getCompanyById(hire.companyId);
    const ownerPhone = company?.ownerPhone || '';

    await airtableClient.logMessage({
      companyId: hire.companyId,
      hireId: hire.id,
      direction: 'Inbound',
      channel: 'SMS',
      type: 'INBOUND',
      body,
      fromPhone,
      createdAt: new Date().toISOString()
    });

    if (/^yes$/i.test(body)) {
      await airtableClient.updateHire(hire.id, { dispatchStatus: 'Accepted' });
      if (ownerPhone) await sendSms(ownerPhone, `${hire.fullName} accepted the job request.`);
      return ok({ dispatch: 'accepted' });
    }

    if (/^no$/i.test(body)) {
      await airtableClient.updateHire(hire.id, { dispatchStatus: 'Declined' });
      if (ownerPhone) await sendSms(ownerPhone, `${hire.fullName} declined the job request.`);
      return ok({ dispatch: 'declined' });
    }

    await respondToFaq(hire.companyId, hire.id, fromPhone, body, ownerPhone);
    return ok({ handled: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed');
  }
}
