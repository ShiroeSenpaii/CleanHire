import Airtable from 'airtable';
import { env } from '@/lib/env';
import type { Company, FAQEntry, Hire, HireItem, MessageLog, RequiredItem } from '@/types/models';

const TABLES = {
  companies: 'Companies',
  hires: 'Hires',
  requiredItems: 'RequiredItems',
  hireItems: 'HireItems',
  faq: 'FAQ',
  messages: 'MessagesLog'
} as const;

const base = env.AIRTABLE_API_KEY && env.AIRTABLE_BASE_ID
  ? new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID)
  : null;

function requireBase() {
  if (!base) throw new Error('Airtable not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID.');
  return base;
}

function map<T>(r: Airtable.Record<any>): T {
  return { id: r.id, ...r.fields } as T;
}

function escapeFormula(value: string) {
  return value.replace(/'/g, "\\'");
}

export const airtableClient = {
  async healthCheck() {
    const b = requireBase();
    const tables = Object.values(TABLES);
    const reachable = await Promise.all(
      tables.map(async (table) => {
        try {
          await b(table).select({ maxRecords: 1 }).firstPage();
          return { table, ok: true };
        } catch (error) {
          return { table, ok: false, error: error instanceof Error ? error.message : 'Unknown' };
        }
      })
    );

    return { configured: !!base, tables: reachable, ok: reachable.every((t) => t.ok) };
  },

  async listCompanies(): Promise<Company[]> {
    const b = requireBase();
    const records = await b(TABLES.companies).select({ sort: [{ field: 'name', direction: 'asc' }] }).all();
    return records.map((r) => map<Company>(r));
  },

  async createCompany(input: Omit<Company, 'id'>): Promise<Company> {
    const b = requireBase();
    const rec = await b(TABLES.companies).create(input as any);
    return map<Company>(rec);
  },

  async getCompanyById(companyId: string): Promise<Company | null> {
    const b = requireBase();
    try {
      const rec = await b(TABLES.companies).find(companyId);
      return map<Company>(rec);
    } catch {
      return null;
    }
  },

  async listHires(companyId: string): Promise<Hire[]> {
    const b = requireBase();
    const records = await b(TABLES.hires).select({
      filterByFormula: `{companyId} = '${escapeFormula(companyId)}'`,
      sort: [{ field: 'createdAt', direction: 'desc' }]
    }).all();
    return records.map((r) => map<Hire>(r));
  },

  async createHire(fields: Omit<Hire, 'id'>): Promise<Hire> {
    const b = requireBase();
    const rec = await b(TABLES.hires).create(fields as any);
    return map<Hire>(rec);
  },

  async getHireById(hireId: string): Promise<Hire | null> {
    const b = requireBase();
    try {
      const rec = await b(TABLES.hires).find(hireId);
      return map<Hire>(rec);
    } catch {
      return null;
    }
  },

  async getHireByTokenHash(tokenHash: string): Promise<Hire | null> {
    const b = requireBase();
    const records = await b(TABLES.hires).select({ filterByFormula: `{magicTokenHash}='${escapeFormula(tokenHash)}'`, maxRecords: 1 }).all();
    return records.length ? map<Hire>(records[0]) : null;
  },

  async updateHire(hireId: string, fields: Partial<Hire>): Promise<void> {
    const b = requireBase();
    await b(TABLES.hires).update(hireId, fields as any);
  },

  async listRequiredItems(companyId: string): Promise<RequiredItem[]> {
    const b = requireBase();
    const records = await b(TABLES.requiredItems).select({
      filterByFormula: `{companyId} = '${escapeFormula(companyId)}'`,
      sort: [{ field: 'order', direction: 'asc' }]
    }).all();
    return records.map((r) => map<RequiredItem>(r));
  },

  async createRequiredItems(items: Omit<RequiredItem, 'id'>[]): Promise<RequiredItem[]> {
    const b = requireBase();
    const created = await b(TABLES.requiredItems).create(items.map((i) => ({ fields: i as any })));
    return created.map((r) => map<RequiredItem>(r));
  },

  async listHireItems(hireId: string): Promise<HireItem[]> {
    const b = requireBase();
    const records = await b(TABLES.hireItems).select({ filterByFormula: `{hireId}='${escapeFormula(hireId)}'` }).all();
    return records.map((r) => map<HireItem>(r));
  },

  async createHireItems(items: Omit<HireItem, 'id'>[]): Promise<HireItem[]> {
    const b = requireBase();
    const created = await b(TABLES.hireItems).create(items.map((i) => ({ fields: i as any })));
    return created.map((r) => map<HireItem>(r));
  },

  async updateHireItem(id: string, fields: Partial<HireItem>): Promise<void> {
    const b = requireBase();
    await b(TABLES.hireItems).update(id, fields as any);
  },

  async listFaq(companyId: string): Promise<FAQEntry[]> {
    const b = requireBase();
    const records = await b(TABLES.faq).select({ filterByFormula: `{companyId}='${escapeFormula(companyId)}'` }).all();
    return records.map((r) => map<FAQEntry>(r));
  },

  async createFaq(entry: Omit<FAQEntry, 'id'>): Promise<FAQEntry> {
    const b = requireBase();
    const rec = await b(TABLES.faq).create(entry as any);
    return map<FAQEntry>(rec);
  },

  async updateFaq(id: string, fields: Partial<FAQEntry>): Promise<void> {
    const b = requireBase();
    await b(TABLES.faq).update(id, fields as any);
  },

  async deleteFaq(id: string): Promise<void> {
    const b = requireBase();
    await b(TABLES.faq).destroy(id);
  },

  async logMessage(entry: Omit<MessageLog, 'id'>): Promise<void> {
    const b = requireBase();
    await b(TABLES.messages).create(entry as any);
  }
};
