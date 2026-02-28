export type HireStatus = 'Not started' | 'Missing' | 'Ready for review' | 'Complete';
export type ItemStatus = 'Missing' | 'Submitted' | 'Approved' | 'Rejected';

export interface Company {
  id: string;
  name: string;
  ownerPhone: string;
  ownerName: string;
  ownerEmail?: string;
  dashboardPasswordHash: string;
  remindersConfig: string;
  defaultTimezone?: string;
}

export interface Hire {
  id: string;
  companyId: string;
  fullName: string;
  phone: string;
  status: HireStatus;
  magicTokenHash: string;
  tokenExpiresAt: string;
  driveFolderId: string;
  reminderCount: number;
  lastReminderAt?: string;
  dispatchStatus?: 'Awaiting response' | 'Accepted' | 'Declined' | 'None';
  createdAt: string;
}

export interface RequiredItem {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  required: boolean;
  order: number;
}

export interface HireItem {
  id: string;
  hireId: string;
  requiredItemId: string;
  itemName: string;
  status: ItemStatus;
  driveFileId?: string;
  driveFileUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface MessageLog {
  id: string;
  companyId: string;
  hireId?: string;
  direction: 'Outbound' | 'Inbound';
  channel: 'SMS';
  type: string;
  body: string;
  fromPhone?: string;
  toPhone?: string;
  twilioSid?: string;
  metaJson?: string;
  createdAt: string;
}

export interface FAQEntry {
  id: string;
  companyId: string;
  question: string;
  answer: string;
  tags?: string;
  active: boolean;
}

export interface DispatchRequest {
  id: string;
  hireId: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: string;
}
