You are Codex (agentic coding assistant). Build a V1 web product called **CleanOps Onboarding**.

## Product goal
Move a cleaning business new hire from:
**invited -> paperwork complete -> trained/FAQ ready -> first job confirmed (dispatch lite)**

Single channel: SMS first (Twilio). Keep WhatsApp-ready as a toggle later.

## V1 scope (must-have)
### Module A) Paperwork chase
Owner creates a hire -> system sends a magic link -> hire uploads required docs on mobile -> system auto-reminds -> owner approves/rejects -> Drive filing.

### Module B) SOP/FAQ in the same chat
Owner adds 10-30 FAQs/SOP snippets. Hire can text questions. The system replies ONLY using approved FAQ content (no freeform hallucinations). If low confidence -> escalate to owner.

### Module C) Dispatch Lite
Owner assigns a job (text + optional date/time/address note) -> hire replies YES/NO -> dashboard updates. No routing optimization.

## Non-goals (explicitly NOT in V1)
- Full scheduling platform / route planning
- Payroll processing (only export hours later)
- Identity verification
- Background check integrations
- Multi-industry support

## Tech choices (use these unless blocked)
- Next.js (App Router) + TypeScript
- Airtable as the database (Companies, Hires, HireItems, Messages, FAQ)
- Google Drive API for filing docs into a per-hire folder
- Twilio SMS for messaging (send + receive webhooks)
- OpenAI API only for FAQ matching (strict: select best FAQ entries, then reply using their text)

## Data model (Airtable tables)
1) Companies
2) Hires
3) RequiredItems
4) HireItems (join table)
5) MessagesLog
6) FAQ

Create an `airtable_schema.md` with exact fields/types and example records.

## Key flows (implement end-to-end)
1) Owner creates hire
- Generate token
- Create Drive folder
- Create HireItems rows from RequiredItems
- Send invite SMS with magic link
- Log message

2) Hire portal (web)
- Token-based access (no login)
- Shows required items and upload controls
- Upload sends to API -> saves to Drive -> updates Airtable -> marks items Submitted

3) Reminder worker
- Daily job that finds hires still missing items and sends Day 1/3/7 reminders (configurable)
- Stop after 3 reminders, then alert owner
(Implement as a server route + a simple cron runner script; document how to schedule on Render/VPS/n8n cron.)

4) Owner review
- Owner dashboard: approve/reject each item
- If reject: send SMS to hire with the specific item + reason + link to re-upload

5) FAQ bot (SMS inbound)
- Incoming SMS from hire -> match to FAQ entries for that company
- Reply with best answer if confidence >= threshold; otherwise forward to owner and reply to hire: “I’ve asked the owner, you’ll get a reply soon.”

6) Dispatch Lite
- Owner selects hire -> sends job request template
- Hire replies YES/NO -> update status and notify owner

## UI requirements (keep simple)
- Owner dashboard pages:
  - Hires list with status columns: Not started / Missing / Ready for review / Complete
  - Hire detail: items + approve/reject + message log + “send job request” button
  - FAQ editor (CRUD)
- Hire portal:
  - Mobile-first upload page
  - Shows checklist + progress

## Security + privacy rules
- Do NOT store sensitive bank/SSN as plain text.
- Prefer document upload for W9/direct deposit rather than typed SSN/bank.
- Store only Drive links + item status in Airtable.
- Use signed, time-limited download links for the owner UI if feasible; otherwise restrict access to owner dashboard with a simple password login for V1.

## Deliverables
- Working Next.js app
- Twilio webhook handlers (inbound + status)
- Google Drive integration (folder creation + file uploads)
- Airtable integration wrapper with typed models
- README with setup steps + environment variables
- Minimal test coverage for core services (token generation, Airtable CRUD wrapper, FAQ selection parsing)

## Workflow
1) Start by writing an implementation plan (phases + files).
2) Generate the project scaffold.
3) Implement one flow at a time and add a basic manual test checklist in README.
4) Keep everything deterministic and boring.

At the end, provide:
- A short “How to run locally”
- A short “How to deploy MVP”
- A short “What to build next (V1.1)”
