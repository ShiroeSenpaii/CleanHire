import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';

export async function GET(req: NextRequest) {
  try {
    const companyId = req.nextUrl.searchParams.get('companyId');
    if (!companyId) return NextResponse.json({ error: 'companyId is required' }, { status: 400 });

    const hires = await airtableClient.listHires(companyId);
    const hireRows = await Promise.all(hires.map(async (hire) => {
      const items = await airtableClient.listHireItems(hire.id);
      const missingCount = items.filter((i) => i.status === 'Missing' || i.status === 'Rejected').length;
      return { ...hire, missingCount };
    }));

    return NextResponse.json({ hires: hireRows });
  } catch (error) {
    console.error('list hires failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list hires' }, { status: 500 });
  }
}
