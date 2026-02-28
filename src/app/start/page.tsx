'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorBanner } from '@/components/ErrorBanner';

interface HireItem { id: string; itemName: string; status: string; rejectionReason?: string }

export default function StartPage() {
  const token = useSearchParams().get('token') || '';
  const [items, setItems] = useState<HireItem[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch(`/api/hire/start?token=${token}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to load onboarding link');
    setItems(data.items || []);
    setName(data.hire?.fullName || '');
  }

  useEffect(() => { if (token) void load(); }, [token]);

  async function upload(hireItemId: string, file: File) {
    const form = new FormData();
    form.append('token', token);
    form.append('hireItemId', hireItemId);
    form.append('file', file);
    const res = await fetch('/api/hire/submit', { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Upload failed');
    void load();
  }

  return (
    <div className="grid">
      <div className="card"><h2>Welcome {name}</h2><p>Upload required paperwork.</p></div>
      <ErrorBanner message={error} />
      {items.map((i) => (
        <div className="card" key={i.id}>
          <strong>{i.itemName}</strong>
          <p>Status: {i.status}</p>
          {i.rejectionReason && <p style={{ color: 'red' }}>{i.rejectionReason}</p>}
          <input type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(i.id, file); }} />
        </div>
      ))}
    </div>
  );
}
