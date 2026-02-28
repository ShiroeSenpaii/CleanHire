import { airtableClient } from '@/lib/airtable/client';
import { generateMagicToken, hashToken } from '@/lib/auth/token';
import { env } from '@/lib/env';
import { createHireFolder } from '@/lib/services/drive';
import { sendSms } from '@/lib/services/twilio';
import type { HireItem, RequiredItem } from '@/types/models';

const DEFAULT_REQUIRED_ITEMS: Array<Pick<RequiredItem, 'name' | 'description' | 'order'>> = [
  { name: 'Contract', description: 'Signed employment contract', order: 1 },
  { name: 'W9', description: 'W9 document upload', order: 2 },
  { name: 'ID', description: 'Government photo ID', order: 3 },
  { name: 'DirectDeposit', description: 'Direct deposit form/document', order: 4 }
];

export async function ensureRequiredItems(companyId: string): Promise<RequiredItem[]> {
  const existing = await airtableClient.listRequiredItems(companyId);
  if (existing.length) return existing;

  return airtableClient.createRequiredItems(
    DEFAULT_REQUIRED_ITEMS.map((item) => ({
      companyId,
      name: item.name,
      description: item.description,
      required: true,
      order: item.order
    }))
  );
}

export async function createHireAndInvite(input: { companyId: string; fullName: string; phone: string; email?: string }) {
  const token = generateMagicToken();
  const tokenHash = hashToken(token);
  const folder = await createHireFolder(input.fullName);

  const hire = await airtableClient.createHire({
    companyId: input.companyId,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    status: 'Not started',
    magicTokenHash: tokenHash,
    tokenExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    magicLinkUrl: `${env.NEXT_PUBLIC_APP_URL}/start?token=${token}`,
    driveFolderId: folder.id,
    reminderCount: 0,
    dispatchStatus: 'None',
    createdAt: new Date().toISOString()
  });

  const requiredItems = await ensureRequiredItems(input.companyId);
  const hireItems: Omit<HireItem, 'id'>[] = requiredItems.map((item) => ({
    hireId: hire.id,
    requiredItemId: item.id,
    itemName: item.name,
    status: 'Missing'
  }));
  await airtableClient.createHireItems(hireItems);

  const inviteText = `Hi ${input.fullName}, complete onboarding: ${env.NEXT_PUBLIC_APP_URL}/start?token=${token}`;
  const sms = await sendSms(input.phone, inviteText);
  await airtableClient.logMessage({
    companyId: input.companyId,
    hireId: hire.id,
    direction: 'Outbound',
    channel: 'SMS',
    type: 'Invite',
    body: inviteText,
    toPhone: input.phone,
    twilioSid: sms.sid,
    createdAt: new Date().toISOString()
  });

  return { hire, token, magicLinkUrl: `${env.NEXT_PUBLIC_APP_URL}/start?token=${token}` };
}
