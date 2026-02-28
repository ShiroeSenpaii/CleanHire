import { NextRequest, NextResponse } from 'next/server';
import { createHireAndInvite } from '@/lib/services/onboarding';
import { normalizePhone } from '@/lib/phone';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.companyId) return NextResponse.json({ error: 'companyId is required' }, { status: 400 });

    const result = await createHireAndInvite({
      companyId: body.companyId,
      fullName: body.fullName,
      phone: normalizePhone(body.phone),
      email: body.email
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('create hire failed', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create hire' }, { status: 400 });
  }
}
