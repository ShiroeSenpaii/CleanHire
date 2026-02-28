# CleanOps Onboarding V1

## What this version does
- Passcode login with signed HTTP-only session cookie.
- Companies admin (create + list) and company selection workflow.
- Hires flow: create hire, auto-create required item checklist, list + detail + approve/reject.
- Magic link onboarding portal: `/start?token=...` with document upload.
- FAQ CRUD scoped by selected company.
- `/api/health` diagnostics.
- Twilio and Drive are optional for local dev.

## Routes
- UI: `/login`, `/logout`, `/companies`, `/hires`, `/hires/[hireId]`, `/faq`, `/start?token=...`
- Admin API (auth required by middleware): `/api/admin/*`
- Public API: `/api/login`, `/api/logout`, `/api/hire/start`, `/api/hire/submit`, `/api/health`

## Setup
1. Copy `.env.example` to `.env.local`.
2. Fill Airtable vars (`AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`).
3. Create Airtable fields exactly as in `airtable_schema.md`.
4. Install deps: `npm install`.
5. Optional seed: `node scripts/seed-airtable.mjs`.
6. Run app: `npm run dev`.

## Required env vars
- `OWNER_PASSCODE`
- `SESSION_SECRET`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`

## Optional env vars
- `DEFAULT_COMPANY_ID` and `NEXT_PUBLIC_DEFAULT_COMPANY_ID` for single-company mode
- Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- Drive: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_DRIVE_PARENT_FOLDER_ID`
- FAQ match: `OPENAI_API_KEY`

If Twilio is not configured, hire creation still succeeds and logs: `invite would be sent to ...`.
If Drive is not configured, uploads are stored under `/tmp/cleanops`.

## Airtable setup notes
If schema differs from field names above, API calls will fail. Check `/api/health` to verify table reachability.

## Acceptance checklist
- Cannot access `/hires` when logged out (redirect to `/login`).
- Login persists; refresh still keeps access.
- Create company from `/companies`.
- Select company and create hire from `/hires`; row appears after refresh.
- Open `/hires/[hireId]`; required items exist and can be approved/rejected.
- Open `/start?token=...`; upload one file; item moves to `Submitted`.

## Deploy MVP
- Deploy Next.js app (Vercel/Render).
- Add env vars.
- Set daily cron hitting reminders endpoint if you use reminder flow.
