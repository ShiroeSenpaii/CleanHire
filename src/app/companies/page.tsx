'use client';

import { useEffect, useState } from 'react';
import { ErrorBanner } from '@/components/ErrorBanner';

interface Company { id: string; name: string; ownerName: string; ownerEmail?: string; ownerPhone: string; channel: string }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', ownerName: '', ownerEmail: '', ownerPhone: '', channel: 'sms' });

  async function load() {
    const res = await fetch('/api/admin/companies');
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to load companies');
    setCompanies(data.companies || []);
  }

  useEffect(() => { void load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/companies', { method: 'POST', body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to create company');
    setForm({ name: '', ownerName: '', ownerEmail: '', ownerPhone: '', channel: 'sms' });
    void load();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Companies</h2>
        <ErrorBanner message={error} />
        <form className="grid grid-cols-2" onSubmit={create}>
          <input placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Owner name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
          <input placeholder="Owner email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />
          <input placeholder="Owner phone" value={form.ownerPhone} onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })} />
          <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}><option value="sms">sms</option><option value="whatsapp">whatsapp</option></select>
          <button type="submit">Create Company</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Owner</th><th>Phone</th><th>Channel</th></tr></thead>
          <tbody>{companies.map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.ownerName}</td><td>{c.ownerPhone}</td><td>{c.channel}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
