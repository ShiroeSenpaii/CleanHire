import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';

export async function PATCH(req: NextRequest, { params }: { params: { faqId: string } }) {
  try {
    const body = await req.json();
    await airtableClient.updateFaq(params.faqId, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('faq update failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update FAQ' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { faqId: string } }) {
  try {
    await airtableClient.deleteFaq(params.faqId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('faq delete failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete FAQ' }, { status: 400 });
  }
}
