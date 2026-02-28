'use client';

import { useEffect, useState } from 'react';
import type { FAQEntry } from '@/types/models';

export default function FAQPage() {
  const [companyId, setCompanyId] = useState('');
  const [faq, setFaq] = useState<FAQEntry[]>([]);
  const [form, setForm] = useState({ question: '', answer: '', tags: '' });

  async function load() {
    if (!companyId) return;
    const res = await fetch(`/api/owner/faq?companyId=${companyId}`);
    if (res.ok) {
      const data = await res.json();
      setFaq(data.faq || []);
    }
  }

  useEffect(() => { void load(); }, [companyId]);

  async function createFaq(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/owner/faq', { method: 'POST', body: JSON.stringify({ companyId, ...form, active: true }) });
    setForm({ question: '', answer: '', tags: '' });
    void load();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>FAQ / SOP Editor</h2>
        <input placeholder="Company ID" value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
      </div>
      <div className="card">
        <form className="grid" onSubmit={createFaq}>
          <input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <textarea placeholder="Approved answer" rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          <input placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <button type="submit">Add FAQ</button>
        </form>
      </div>
      <div className="card">
        <ul>{faq.map((entry) => <li key={entry.id}><strong>{entry.question}</strong><br />{entry.answer}</li>)}</ul>
      </div>
    </div>
  );
}
