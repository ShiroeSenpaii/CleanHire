# Airtable schema for CleanOps Onboarding

Create these tables **with exact field names**:

## Companies
- `name` (single line text)
- `ownerName` (single line text)
- `ownerEmail` (email)
- `ownerPhone` (phone)
- `channel` (single select: `sms`, `whatsapp`)

## Hires
- `companyId` (single line text)
- `fullName` (single line text)
- `phone` (phone)
- `email` (email)
- `status` (single select: `Not started`, `Missing`, `Ready for review`, `Complete`)
- `magicTokenHash` (single line text)
- `tokenExpiresAt` (date/time)
- `magicLinkUrl` (url)
- `driveFolderId` (single line text)
- `reminderCount` (number)
- `lastReminderAt` (date/time)
- `dispatchStatus` (single select: `None`, `Awaiting response`, `Accepted`, `Declined`)
- `createdAt` (date/time)

## RequiredItems
- `companyId` (single line text)
- `name` (single line text)
- `description` (long text)
- `required` (checkbox)
- `order` (number)

## HireItems
- `hireId` (single line text)
- `requiredItemId` (single line text)
- `itemName` (single line text)
- `status` (single select: `Missing`, `Submitted`, `Approved`, `Rejected`)
- `driveFileId` (single line text)
- `driveFileUrl` (url)
- `submittedAt` (date/time)
- `reviewedAt` (date/time)
- `rejectionReason` (long text)

## FAQ
- `companyId` (single line text)
- `question` (long text)
- `approved_answer` (long text)
- `tags` (single line text)

## MessagesLog
- `companyId` (single line text)
- `hireId` (single line text)
- `direction` (single select: `Outbound`, `Inbound`)
- `channel` (single select: `SMS`)
- `type` (single line text)
- `body` (long text)
- `fromPhone` (phone)
- `toPhone` (phone)
- `twilioSid` (single line text)
- `metaJson` (long text)
- `createdAt` (date/time)
