import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId');
    if (!companyId) return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    return NextResponse.json({ faq: await airtableClient.listFaq(companyId) });
  } catch (error) {
    console.error('faq list failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list FAQ' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const faq = await airtableClient.createFaq({
      companyId: body.companyId,
      question: body.question,
      approved_answer: body.approved_answer,
      tags: body.tags
    });
    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error('faq create failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create FAQ' }, { status: 400 });
  }
}
