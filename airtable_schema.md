# Airtable Schema (CleanOps Onboarding)

## 1) Companies
| Field | Type | Notes |
|---|---|---|
| name | Single line text | Company display name |
| ownerName | Single line text | Owner/operator name |
| ownerPhone | Phone number | SMS destination for escalations |
| ownerEmail | Email | Optional |
| dashboardPasswordHash | Single line text | Hash only (never plain password) |
| remindersConfig | Single line text | ex: `1,3,7` |
| defaultTimezone | Single line text | ex: `America/Chicago` |

Example record:
```json
{"id":"cmp_1","name":"Sparkle Pros","ownerName":"Maya Ortiz","ownerPhone":"+15551230001","dashboardPasswordHash":"$2b$...","remindersConfig":"1,3,7","defaultTimezone":"America/Chicago"}
```

## 2) Hires
| Field | Type |
|---|---|
| companyId | Link/Text |
| fullName | Single line text |
| phone | Phone number |
| status | Single select (`Not started`,`Missing`,`Ready for review`,`Complete`) |
| magicTokenHash | Single line text |
| tokenExpiresAt | Date/time |
| driveFolderId | Single line text |
| reminderCount | Number |
| lastReminderAt | Date/time |
| dispatchStatus | Single select (`None`,`Awaiting response`,`Accepted`,`Declined`) |
| createdAt | Date/time |

Example:
```json
{"id":"hire_1","companyId":"cmp_1","fullName":"Ana Diaz","phone":"+15551230020","status":"Missing","magicTokenHash":"abc123...","tokenExpiresAt":"2026-03-20T00:00:00Z","driveFolderId":"1Jd...","reminderCount":1,"dispatchStatus":"Awaiting response","createdAt":"2026-02-28T11:00:00Z"}
```

## 3) RequiredItems
| Field | Type |
|---|---|
| companyId | Link/Text |
| name | Single line text |
| description | Long text |
| required | Checkbox |
| order | Number |

## 4) HireItems
| Field | Type |
|---|---|
| hireId | Link/Text |
| requiredItemId | Link/Text |
| itemName | Single line text |
| status | Single select (`Missing`,`Submitted`,`Approved`,`Rejected`) |
| driveFileId | Single line text |
| driveFileUrl | URL |
| submittedAt | Date/time |
| reviewedAt | Date/time |
| rejectionReason | Long text |

## 5) MessagesLog
| Field | Type |
|---|---|
| companyId | Link/Text |
| hireId | Link/Text |
| direction | Single select (`Outbound`,`Inbound`) |
| channel | Single select (`SMS`) |
| type | Single line text |
| body | Long text |
| fromPhone | Phone |
| toPhone | Phone |
| twilioSid | Single line text |
| metaJson | Long text |
| createdAt | Date/time |

## 6) FAQ
| Field | Type |
|---|---|
| companyId | Link/Text |
| question | Long text |
| answer | Long text |
| tags | Single line text |
| active | Checkbox |

Example:
```json
{"id":"faq_1","companyId":"cmp_1","question":"Where do I pick up keys?","answer":"Pick up keys at office at 8:30am.","tags":"keys,office","active":true}
```
