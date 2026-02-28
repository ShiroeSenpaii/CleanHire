import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { hashToken } from '@/lib/auth/token';
import { uploadFileToHireFolder } from '@/lib/services/drive';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const token = String(form.get('token') || '');
    const hireItemId = String(form.get('hireItemId') || '');
    const file = form.get('file');

    if (!(file instanceof File)) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

    const hire = await airtableClient.getHireByTokenHash(hashToken(token));
    if (!hire) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const uploaded = await uploadFileToHireFolder(hire.driveFolderId, file.name, file.type || 'application/octet-stream', Buffer.from(await file.arrayBuffer()));

    await airtableClient.updateHireItem(hireItemId, {
      status: 'Submitted',
      driveFileId: uploaded.id,
      driveFileUrl: uploaded.webViewLink,
      submittedAt: new Date().toISOString()
    });

    await airtableClient.updateHire(hire.id, { status: 'Ready for review' });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('hire submit failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 400 });
  }
}
