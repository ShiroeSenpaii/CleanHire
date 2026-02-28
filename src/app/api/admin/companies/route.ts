import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { normalizePhone } from '@/lib/phone';

export async function GET() {
  try {
    return NextResponse.json({ companies: await airtableClient.listCompanies() });
  } catch (error) {
    console.error('companies list failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list companies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const company = await airtableClient.createCompany({
      name: body.name,
      ownerName: body.ownerName,
      ownerEmail: body.ownerEmail,
      ownerPhone: normalizePhone(body.ownerPhone),
      channel: body.channel || 'sms'
    });
    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error('companies create failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create company' }, { status: 400 });
  }
}
