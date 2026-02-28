'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Hire } from '@/types/models';

export default function HiresPage() {
  const [hires, setHires] = useState<Hire[]>([]);
  const [form, setForm] = useState({ companyId: '', fullName: '', phone: '' });

  async function load() {
    const res = await fetch('/api/owner/hire');
    if (res.ok) {
      const data = await res.json();
      setHires(data.hires || []);
    }
  }

  useEffect(() => { void load(); }, []);

  async function createHire(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/owner/hire', { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) {
      setForm({ companyId: form.companyId, fullName: '', phone: '' });
      void load();
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Create Hire</h2>
        <form className="grid grid-cols-2" onSubmit={createHire}>
          <input placeholder="Company ID" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} />
          <input placeholder="Hire full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input placeholder="Hire phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button type="submit">Create + Send Invite</button>
        </form>
      </div>

      <div className="card">
        <h2>Hires</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Status</th><th>Dispatch</th><th /></tr>
          </thead>
          <tbody>
            {hires.map((hire) => (
              <tr key={hire.id}>
                <td>{hire.fullName}</td>
                <td>{hire.phone}</td>
                <td>{hire.status}</td>
                <td>{hire.dispatchStatus}</td>
                <td><Link href={`/owner/hires/${hire.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
