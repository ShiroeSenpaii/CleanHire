'use client';

import { useEffect, useState } from 'react';
import { ErrorBanner } from '@/components/ErrorBanner';

interface Hire { id: string; fullName: string; phone: string; magicLinkUrl?: string }
interface HireItem { id: string; itemName: string; status: string; driveFileUrl?: string; rejectionReason?: string }

export default function HireDetailPage({ params }: { params: { hireId: string } }) {
  const [hire, setHire] = useState<Hire | null>(null);
  const [items, setItems] = useState<HireItem[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch(`/api/admin/hire/${params.hireId}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to load hire');
    setHire(data.hire);
    setItems(data.items || []);
  }

  useEffect(() => { void load(); }, [params.hireId]);

  async function review(item: HireItem, action: 'approve' | 'reject') {
    const reason = action === 'reject' ? prompt('Rejection reason') || 'Please re-upload' : '';
    const res = await fetch('/api/admin/hire/review', {
      method: 'POST',
      body: JSON.stringify({ hireItemId: item.id, action, reason, itemName: item.itemName })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to update item');
    void load();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>{hire?.fullName}</h2>
        <p>Phone: {hire?.phone}</p>
        <p>Magic link: {hire?.magicLinkUrl}</p>
      </div>
      <div className="card">
        <ErrorBanner message={error} />
        <table>
          <thead><tr><th>Item</th><th>Status</th><th>Doc</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.itemName}</td>
                <td>{item.status}{item.rejectionReason ? ` (${item.rejectionReason})` : ''}</td>
                <td>{item.driveFileUrl ? <a href={item.driveFileUrl} target="_blank">Open</a> : '-'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => review(item, 'approve')}>Approve</button>
                  <button className="warn" onClick={() => review(item, 'reject')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
