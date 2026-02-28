'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Hire, HireItem } from '@/types/models';

export default function HirePortal() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [hire, setHire] = useState<Hire | null>(null);
  const [items, setItems] = useState<HireItem[]>([]);

  async function load() {
    const res = await fetch(`/api/hire/status?token=${token}`);
    if (res.ok) {
      const data = await res.json();
      setHire(data.hire);
      setItems(data.items || []);
    }
  }

  useEffect(() => { if (token) void load(); }, [token]);

  async function onUpload(hireItemId: string, file: File) {
    const form = new FormData();
    form.append('token', token);
    form.append('hireItemId', hireItemId);
    form.append('file', file);
    await fetch('/api/hire/upload', { method: 'POST', body: form });
    void load();
  }

  const done = items.filter((item) => item.status === 'Submitted' || item.status === 'Approved').length;

  return (
    <div className="grid">
      <div className="card"><h2>Welcome, {hire?.fullName}</h2><p>Progress: {done}/{items.length}</p></div>
      {items.map((item) => (
        <div className="card" key={item.id}>
          <p><strong>{item.itemName}</strong></p>
          <p>Status: {item.status}</p>
          <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onUpload(item.id, f); }} />
          {item.rejectionReason && <p style={{ color: '#b91c1c' }}>Reason: {item.rejectionReason}</p>}
        </div>
      ))}
    </div>
  );
}
