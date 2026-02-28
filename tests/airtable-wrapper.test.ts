import { describe, expect, it } from 'vitest';
import { buildCompanyFilter, mapAirtableRecord } from '@/lib/airtable/helpers';

describe('airtable helper wrappers', () => {
  it('maps record fields + id', () => {
    const mapped = mapAirtableRecord<{ id: string; name: string }>({ id: 'rec_1', fields: { name: 'Acme Clean' } });
    expect(mapped).toEqual({ id: 'rec_1', name: 'Acme Clean' });
  });

  it('escapes single quote in formula', () => {
    expect(buildCompanyFilter("comp'1")).toContain("\\'");
  });
});
