import Twilio from 'twilio';
import { env } from '@/lib/env';

const enabled = !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER);
const client = enabled ? Twilio(env.TWILIO_ACCOUNT_SID!, env.TWILIO_AUTH_TOKEN!) : null;

export async function sendSms(to: string, body: string) {
  if (!client) {
    console.log(`invite would be sent to ${to}: ${body}`);
    return { sid: 'local-skip' };
  }

  const msg = await client.messages.create({ from: env.TWILIO_FROM_NUMBER!, to, body });
  return { sid: msg.sid };
}
