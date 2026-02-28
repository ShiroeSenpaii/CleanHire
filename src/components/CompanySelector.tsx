'use client';

import { useEffect, useState } from 'react';

interface Company { id: string; name: string; }

export function CompanySelector({ onChange, defaultCompanyId }: { onChange: (id: string) => void; defaultCompanyId?: string }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selected, setSelected] = useState(defaultCompanyId || '');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/companies');
      if (!res.ok) return;
      const data = await res.json();
      setCompanies(data.companies || []);
      const fromStorage = defaultCompanyId || localStorage.getItem('selectedCompanyId') || data.companies?.[0]?.id || '';
      setSelected(fromStorage);
      if (fromStorage) onChange(fromStorage);
    }
    void load();
  }, [defaultCompanyId, onChange]);

  useEffect(() => {
    if (!selected) return;
    localStorage.setItem('selectedCompanyId', selected);
    onChange(selected);
  }, [selected, onChange]);

  if (defaultCompanyId) return null;

  return (
    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
      <option value="">Select company</option>
      {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  );
}
