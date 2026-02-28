'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { CompanySelector } from '@/components/CompanySelector';
import { ErrorBanner } from '@/components/ErrorBanner';

interface HireRow { id: string; fullName: string; phone: string; status: string; missingCount: number; createdAt: string }

export default function HiresPage() {
  const [companyId, setCompanyId] = useState(process.env.NEXT_PUBLIC_DEFAULT_COMPANY_ID || '');
  const [hires, setHires] = useState<HireRow[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' });

  const load = useCallback(async () => {
    if (!companyId) return;
    const res = await fetch(`/api/admin/hire?companyId=${companyId}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to load hires');
    setHires(data.hires || []);
  }, [companyId]);

  useEffect(() => { void load(); }, [load]);

  async function createHire(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/hire/create', { method: 'POST', body: JSON.stringify({ ...form, companyId }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to create hire');
    setForm({ fullName: '', phone: '', email: '' });
    void load();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Hires</h2>
        <CompanySelector defaultCompanyId={process.env.NEXT_PUBLIC_DEFAULT_COMPANY_ID} onChange={setCompanyId} />
        <ErrorBanner message={error} />
        <form className="grid grid-cols-2" onSubmit={createHire}>
          <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button type="submit" disabled={!companyId}>Create Hire</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Status</th><th>Missing</th><th>Created</th><th /></tr></thead>
          <tbody>
            {hires.map((h) => (
              <tr key={h.id}>
                <td>{h.fullName}</td>
                <td>{h.phone}</td>
                <td>{h.status}</td>
                <td>{h.missingCount}</td>
                <td>{new Date(h.createdAt).toLocaleString()}</td>
                <td><Link href={`/hires/${h.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
