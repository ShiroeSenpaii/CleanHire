import { NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';

export async function GET(_: Request, { params }: { params: { hireId: string } }) {
  try {
    const hire = await airtableClient.getHireById(params.hireId);
    if (!hire) return NextResponse.json({ error: 'Hire not found' }, { status: 404 });
    const items = await airtableClient.listHireItems(hire.id);
    return NextResponse.json({ hire, items });
  } catch (error) {
    console.error('hire detail failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load hire detail' }, { status: 500 });
  }
}
