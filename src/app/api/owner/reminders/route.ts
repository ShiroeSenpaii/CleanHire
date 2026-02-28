import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { requireOwnerAuth } from '@/lib/auth/session';
import { env } from '@/lib/env';
import { fail, ok } from '@/lib/http';
import { sendReminder } from '@/lib/services/onboarding';
import { generateMagicToken, hashToken } from '@/lib/auth/token';
import { sendSms } from '@/lib/services/twilio';

async function runReminders() {
  const reminderDays = env.REMINDER_DAYS.split(',').map((d) => Number(d.trim()));
  const hires = await airtableClient.listHires();
  let processed = 0;

  for (const hire of hires) {
    if (hire.status === 'Complete') continue;
    if (hire.reminderCount >= reminderDays.length) {
      await sendSms('+10000000000', `Hire ${hire.fullName} exceeded reminder limit`);
      continue;
    }

    const createdDaysAgo = Math.floor((Date.now() - new Date(hire.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const targetDay = reminderDays[hire.reminderCount];
    if (createdDaysAgo >= targetDay) {
      const token = generateMagicToken();
      await airtableClient.updateHire(hire.id, { magicTokenHash: hashToken(token), reminderCount: hire.reminderCount + 1, lastReminderAt: new Date().toISOString() });
      await sendReminder(hire.id, hire.phone, hire.companyId, token, targetDay);
      processed += 1;
    }
  }

  return processed;
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('x-cron-secret');
    if (auth === env.CRON_SHARED_SECRET) {
      return ok({ processed: await runReminders() });
    }

    requireOwnerAuth();
    return ok({ processed: await runReminders() });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Failed', 401);
  }
}
