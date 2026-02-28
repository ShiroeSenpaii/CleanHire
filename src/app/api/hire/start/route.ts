import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { hashToken } from '@/lib/auth/token';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    if (!token) return NextResponse.json({ error: 'token is required' }, { status: 400 });

    const hire = await airtableClient.getHireByTokenHash(hashToken(token));
    if (!hire) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    const company = await airtableClient.getCompanyById(hire.companyId);
    const items = await airtableClient.listHireItems(hire.id);
    return NextResponse.json({ hire, company, items });
  } catch (error) {
    console.error('hire start failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 400 });
  }
}
