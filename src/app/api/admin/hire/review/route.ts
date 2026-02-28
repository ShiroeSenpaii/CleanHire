import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const status = body.action === 'approve' ? 'Approved' : 'Rejected';
    await airtableClient.updateHireItem(body.hireItemId, {
      status,
      rejectionReason: body.reason,
      reviewedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      messageText: status === 'Rejected' ? `Please re-upload ${body.itemName}. Reason: ${body.reason}` : 'Approved'
    });
  } catch (error) {
    console.error('review failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update item' }, { status: 400 });
  }
}
