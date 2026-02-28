import { airtableClient } from '@/lib/airtable/client';
import { generateMagicToken, hashToken } from '@/lib/auth/token';
import { env } from '@/lib/env';
import { matchFaq } from '@/lib/faq/matcher';
import { createHireFolder } from '@/lib/services/drive';
import { sendSms } from '@/lib/services/twilio';
import type { HireItem } from '@/types/models';

export async function createHireAndInvite(input: { companyId: string; fullName: string; phone: string }) {
  const token = generateMagicToken();
  const tokenHash = hashToken(token);
  const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();

  const folder = await createHireFolder(input.fullName);
  const hire = await airtableClient.createHire({
    companyId: input.companyId,
    fullName: input.fullName,
    phone: input.phone,
    status: 'Not started',
    magicTokenHash: tokenHash,
    tokenExpiresAt,
    driveFolderId: folder.id,
    reminderCount: 0,
    dispatchStatus: 'None',
    createdAt: new Date().toISOString()
  });

  const requiredItems = await airtableClient.listRequiredItems(input.companyId);
  const hireItems: Omit<HireItem, 'id'>[] = requiredItems.map((item) => ({
    hireId: hire.id,
    requiredItemId: item.id,
    itemName: item.name,
    status: 'Missing'
  }));
  await airtableClient.createHireItems(hireItems);

  const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/hire/${token}`;
  const body = `Hi ${input.fullName}, welcome! Please complete onboarding paperwork: ${inviteLink}`;
  const sms = await sendSms(input.phone, body);

  await airtableClient.logMessage({
    companyId: input.companyId,
    hireId: hire.id,
    direction: 'Outbound',
    channel: 'SMS',
    type: 'Invite',
    body,
    toPhone: input.phone,
    twilioSid: sms.sid,
    createdAt: new Date().toISOString()
  });

  return { hire, inviteLink };
}

export async function sendReminder(hireId: string, phone: string, companyId: string, token: string, day: number) {
  const link = `${env.NEXT_PUBLIC_APP_URL}/hire/${token}`;
  const body = `Reminder (day ${day}): please finish your onboarding docs: ${link}`;
  const sms = await sendSms(phone, body);
  await airtableClient.logMessage({
    companyId,
    hireId,
    direction: 'Outbound',
    channel: 'SMS',
    type: 'Reminder',
    body,
    toPhone: phone,
    twilioSid: sms.sid,
    createdAt: new Date().toISOString()
  });
}

export async function respondToFaq(companyId: string, hireId: string, fromPhone: string, message: string, ownerPhone: string) {
  const faq = await airtableClient.listFaq(companyId);
  const matched = await matchFaq(message, faq);
  const threshold = Number(env.FAQ_CONFIDENCE_THRESHOLD);

  if (matched.answer && matched.confidence >= threshold) {
    const sms = await sendSms(fromPhone, matched.answer);
    await airtableClient.logMessage({
      companyId,
      hireId,
      direction: 'Outbound',
      channel: 'SMS',
      type: 'FAQ_ANSWER',
      body: matched.answer,
      toPhone: fromPhone,
      twilioSid: sms.sid,
      metaJson: JSON.stringify({ faqId: matched.faqId, confidence: matched.confidence }),
      createdAt: new Date().toISOString()
    });
    return { escalated: false };
  }

  const ownerBody = `Escalation from hire ${hireId}: "${message}"`;
  await sendSms(ownerPhone, ownerBody);
  await sendSms(fromPhone, "I’ve asked the owner, you’ll get a reply soon.");
  return { escalated: true };
}
