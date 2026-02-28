'use client';

import { useEffect, useState } from 'react';
import type { Hire, HireItem, MessageLog } from '@/types/models';

export default function HireDetailPage({ params }: { params: { hireId: string } }) {
  const [hire, setHire] = useState<Hire | null>(null);
  const [items, setItems] = useState<HireItem[]>([]);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [dispatchMessage, setDispatchMessage] = useState('Job request: Tomorrow 9:00AM at 123 Main St.');

  async function load() {
    const res = await fetch(`/api/owner/hire/${params.hireId}`);
    if (!res.ok) return;
    const data = await res.json();
    setHire(data.hire);
    setItems(data.items || []);
    setMessages(data.messages || []);
  }

  useEffect(() => { void load(); }, [params.hireId]);

  async function review(hireItemId: string, action: 'approve' | 'reject') {
    const reason = action === 'reject' ? prompt('Reason?') || 'Please re-upload with clearer photo.' : '';
    await fetch('/api/owner/review', {
      method: 'POST',
      body: JSON.stringify({ hireId: hire?.id, hireItemId, action, reason, phone: hire?.phone, companyId: hire?.companyId, itemName: items.find(i => i.id === hireItemId)?.itemName })
    });
    void load();
  }

  async function sendDispatch() {
    await fetch('/api/owner/dispatch', { method: 'POST', body: JSON.stringify({ hireId: hire?.id, companyId: hire?.companyId, phone: hire?.phone, message: dispatchMessage }) });
    void load();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>{hire?.fullName}</h2>
        <p>Status: <strong>{hire?.status}</strong></p>
        <p>Dispatch: <strong>{hire?.dispatchStatus}</strong></p>
      </div>

      <div className="card">
        <h3>Documents</h3>
        <table>
          <thead><tr><th>Item</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.itemName}</td>
                <td><span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => review(item.id, 'approve')}>Approve</button>
                  <button className="warn" onClick={() => review(item.id, 'reject')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Dispatch Lite</h3>
        <textarea rows={3} value={dispatchMessage} onChange={(e) => setDispatchMessage(e.target.value)} />
        <button onClick={sendDispatch}>Send Job Request</button>
      </div>

      <div className="card">
        <h3>Message Log</h3>
        <ul>
          {messages.map((m) => <li key={m.id}>{m.createdAt} [{m.direction}] {m.body}</li>)}
        </ul>
      </div>
    </div>
  );
}
