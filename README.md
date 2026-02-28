# CleanOps Onboarding (V1)

SMS-first onboarding product for cleaning businesses:
**invited -> paperwork complete -> FAQ/training ready -> first job confirmed**.

## Implementation plan (phases + files)
1. **Scaffold + foundations**
   - `package.json`, `next.config.mjs`, `src/app/layout.tsx`, `src/types/models.ts`
2. **Core service layer + APIs**
   - Airtable: `src/lib/airtable/*`
   - Drive: `src/lib/services/drive.ts`
   - Twilio: `src/lib/services/twilio.ts`
   - FAQ matching: `src/lib/faq/matcher.ts`
   - Flow orchestration: `src/lib/services/onboarding.ts`
   - API routes: `src/app/api/**`
3. **UI**
   - Owner: `src/app/owner/hires/*`, `src/app/owner/faq/page.tsx`
   - Hire portal: `src/app/hire/[token]/page.tsx`
4. **Ops docs + tests**
   - `airtable_schema.md`, `scripts/run-reminders.ts`, `tests/*.test.ts`

## Features included
- Owner creates hire; app creates Drive folder, creates HireItems, sends invite SMS.
- Hire token portal for mobile uploads to Drive with Airtable status updates.
- Reminder job route + script (day 1/3/7 configurable).
- Owner review approve/reject with rejection SMS + re-upload link.
- Inbound SMS FAQ bot (strictly FAQ answer text or escalation to owner).
- Dispatch Lite (owner sends request, hire YES/NO updates status + owner notified).

## Environment variables
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
OWNER_PASSWORD=changeme
SESSION_SECRET=dev-secret

AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

OPENAI_API_KEY=

GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_PARENT_FOLDER_ID=

REMINDER_DAYS=1,3,7
FAQ_CONFIDENCE_THRESHOLD=0.65
CRON_SHARED_SECRET=dev-cron-secret
```

## Manual test checklist
1. Login at `/login`.
2. Create a hire in `/owner/hires`.
3. Open invite link and upload 1+ docs from `/hire/:token`.
4. Approve/reject from owner hire detail page.
5. Send dispatch request and reply YES/NO from hire phone.
6. Send inbound FAQ text and verify answer/escalation behavior.
7. Run reminders manually.

## Reminder scheduling
### Endpoint
`POST /api/owner/reminders` with header `x-cron-secret: $CRON_SHARED_SECRET`

### Local script
```bash
node --env-file=.env.local scripts/run-reminders.ts
```

### Render cron
- Add a Cron Job hitting `https://yourapp.com/api/owner/reminders`
- Header: `x-cron-secret: ...`
- Schedule: `0 14 * * *`

### VPS cron example
```cron
0 14 * * * curl -X POST https://yourapp.com/api/owner/reminders -H 'x-cron-secret: YOUR_SECRET'
```

### n8n cron
- Cron node daily
- HTTP node POST to `/api/owner/reminders` with `x-cron-secret`

## How to run locally
1. Install deps: `npm install`
2. Create `.env.local` with vars above
3. Run: `npm run dev`
4. Open `http://localhost:3000`

## How to deploy MVP
1. Deploy on Vercel/Render as Next.js app.
2. Set all environment variables.
3. Configure Twilio webhooks:
   - inbound: `POST /api/twilio/inbound`
   - delivery status: `POST /api/twilio/status`
4. Share Google Drive parent folder with service account email.
5. Configure daily reminders via cron.

## What to build next (V1.1)
- Owner reply console for escalated FAQ threads.
- Signed file preview URLs for owner UI.
- Better dispatch templates + optional multilingual SMS.
- Retry queue + dead-letter log for external API failures.
