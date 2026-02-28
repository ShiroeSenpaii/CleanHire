import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  OWNER_PASSCODE: z.string().default('changeme'),
  SESSION_SECRET: z.string().default('dev-secret'),
  DEFAULT_COMPANY_ID: z.string().optional(),

  AIRTABLE_API_KEY: z.string().optional(),
  AIRTABLE_BASE_ID: z.string().optional(),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),

  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().optional(),
  GOOGLE_DRIVE_PARENT_FOLDER_ID: z.string().optional(),

  REMINDER_DAYS: z.string().default('1,3,7'),
  FAQ_CONFIDENCE_THRESHOLD: z.string().default('0.65'),
  CRON_SHARED_SECRET: z.string().default('dev-cron-secret')
});

export const env = envSchema.parse(process.env);
