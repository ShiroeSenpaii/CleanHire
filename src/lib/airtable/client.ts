import Airtable from 'airtable';
import { env } from '@/lib/env';
import type { Company, FAQEntry, Hire, HireItem, MessageLog, RequiredItem } from '@/types/models';
import { buildCompanyFilter, mapAirtableRecord } from '@/lib/airtable/helpers';

const base = env.AIRTABLE_API_KEY && env.AIRTABLE_BASE_ID
  ? new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID)
  : null;

function requireBase() {
  if (!base) throw new Error('Airtable not configured');
  return base;
}


export const airtableClient = {

  async getCompanyById(companyId: string): Promise<Company | null> {
    const b = requireBase();
    try {
      const rec = await b('Companies').find(companyId);
      return mapAirtableRecord<Company>(rec);
    } catch {
      return null;
    }
  },

  async listHires(): Promise<Hire[]> {
    const b = requireBase();
    const records = await b('Hires').select({ sort: [{ field: 'createdAt', direction: 'desc' }] }).all();
    return records.map((r) => mapAirtableRecord<Hire>(r));
  },

  async createHire(fields: Omit<Hire, 'id'>): Promise<Hire> {
    const b = requireBase();
    const rec = await b('Hires').create(fields as any);
    return mapAirtableRecord<Hire>(rec);
  },

  async getHireById(hireId: string): Promise<Hire | null> {
    const b = requireBase();
    try {
      const rec = await b('Hires').find(hireId);
      return mapAirtableRecord<Hire>(rec);
    } catch {
      return null;
    }
  },

  async getHireByTokenHash(tokenHash: string): Promise<Hire | null> {
    const b = requireBase();
    const records = await b('Hires').select({ filterByFormula: `{magicTokenHash} = '${tokenHash}'`, maxRecords: 1 }).all();
    return records.length ? mapAirtableRecord<Hire>(records[0]) : null;
  },

  async updateHire(hireId: string, fields: Partial<Hire>): Promise<void> {
    const b = requireBase();
    await b('Hires').update(hireId, fields as any);
  },

  async listRequiredItems(companyId: string): Promise<RequiredItem[]> {
    const b = requireBase();
    const records = await b('RequiredItems').select({ filterByFormula: buildCompanyFilter(companyId), sort: [{ field: 'order', direction: 'asc' }] }).all();
    return records.map((r) => mapAirtableRecord<RequiredItem>(r));
  },

  async createHireItems(items: Omit<HireItem, 'id'>[]): Promise<HireItem[]> {
    const b = requireBase();
    const created = await b('HireItems').create(items.map((item) => ({ fields: item as any })));
    return created.map((r) => mapAirtableRecord<HireItem>(r));
  },

  async listHireItems(hireId: string): Promise<HireItem[]> {
    const b = requireBase();
    const records = await b('HireItems').select({ filterByFormula: `{hireId} = '${hireId}'` }).all();
    return records.map((r) => mapAirtableRecord<HireItem>(r));
  },

  async updateHireItem(hireItemId: string, fields: Partial<HireItem>): Promise<void> {
    const b = requireBase();
    await b('HireItems').update(hireItemId, fields as any);
  },

  async logMessage(message: Omit<MessageLog, 'id'>): Promise<void> {
    const b = requireBase();
    await b('MessagesLog').create(message as any);
  },

  async listMessages(hireId: string): Promise<MessageLog[]> {
    const b = requireBase();
    const records = await b('MessagesLog').select({ filterByFormula: `{hireId} = '${hireId}'`, sort: [{ field: 'createdAt', direction: 'desc' }] }).all();
    return records.map((r) => mapAirtableRecord<MessageLog>(r));
  },

  async listFaq(companyId: string): Promise<FAQEntry[]> {
    const b = requireBase();
    const records = await b('FAQ').select({ filterByFormula: `AND({companyId}='${companyId}', {active}=1)` }).all();
    return records.map((r) => mapAirtableRecord<FAQEntry>(r));
  },

  async createFaq(entry: Omit<FAQEntry, 'id'>): Promise<FAQEntry> {
    const b = requireBase();
    const rec = await b('FAQ').create(entry as any);
    return mapAirtableRecord<FAQEntry>(rec);
  },

  async updateFaq(faqId: string, fields: Partial<FAQEntry>): Promise<void> {
    const b = requireBase();
    await b('FAQ').update(faqId, fields as any);
  },
};
