import Twilio from 'twilio';
import { env } from '@/lib/env';

const client = env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN
  ? Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
  : null;

export async function sendSms(to: string, body: string) {
  if (!client || !env.TWILIO_FROM_NUMBER) {
    console.warn('Twilio not configured, skipped send', { to, body });
    return { sid: 'mocked' };
  }

  const res = await client.messages.create({
    to,
    from: env.TWILIO_FROM_NUMBER,
    body
  });

  return { sid: res.sid };
}
