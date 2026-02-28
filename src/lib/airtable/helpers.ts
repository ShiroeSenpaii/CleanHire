export interface AirtableLikeRecord {
  id: string;
  fields: Record<string, unknown>;
}

export function mapAirtableRecord<T>(record: AirtableLikeRecord): T {
  return { id: record.id, ...record.fields } as T;
}

export function buildCompanyFilter(companyId: string): string {
  return `{companyId} = '${companyId.replace(/'/g, "\\'")}'`;
}
