import { NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable/client';
import { env } from '@/lib/env';

function missingEnv() {
  const required = ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'SESSION_SECRET', 'OWNER_PASSCODE'] as const;
  return required.filter((key) => !process.env[key]);
}

export async function GET() {
  try {
    const airtable = await airtableClient.healthCheck();
    return NextResponse.json({
      status: airtable.ok ? 'ok' : 'degraded',
      airtable,
      missingEnv: missingEnv(),
      optionalMissing: {
        twilio: !(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER),
        drive: !(env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
      }
    });
  } catch (error) {
    console.error('health check failed', error);
    return NextResponse.json({ status: 'error', error: error instanceof Error ? error.message : 'health failed', missingEnv: missingEnv() }, { status: 500 });
  }
}
