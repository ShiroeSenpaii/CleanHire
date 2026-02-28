import { NextRequest } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { hashToken } from '@/lib/auth/token';
import { fail, ok } from '@/lib/http';
import { uploadFileToHireFolder } from '@/lib/services/drive';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const token = String(form.get('token') || '');
    const hireItemId = String(form.get('hireItemId') || '');
    const file = form.get('file');
    if (!token || !hireItemId || !(file instanceof File)) return fail('Invalid payload');

    const hire = await airtableClient.getHireByTokenHash(hashToken(token));
    if (!hire) return fail('Invalid token', 401);

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadFileToHireFolder(hire.driveFolderId, file.name, file.type || 'application/octet-stream', buffer);

    await airtableClient.updateHireItem(hireItemId, {
      status: 'Submitted',
      driveFileId: uploaded.id,
      driveFileUrl: uploaded.webViewLink,
      submittedAt: new Date().toISOString()
    });

    await airtableClient.updateHire(hire.id, { status: 'Ready for review' });
    return ok({ success: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Upload failed');
  }
}
