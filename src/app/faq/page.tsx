'use client';

import { useCallback, useEffect, useState } from 'react';
import { CompanySelector } from '@/components/CompanySelector';
import { ErrorBanner } from '@/components/ErrorBanner';

interface FAQ { id: string; question: string; approved_answer: string; tags?: string }

export default function FaqPage() {
  const [companyId, setCompanyId] = useState(process.env.NEXT_PUBLIC_DEFAULT_COMPANY_ID || '');
  const [list, setList] = useState<FAQ[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ question: '', approved_answer: '', tags: '' });

  const load = useCallback(async () => {
    if (!companyId) return;
    const res = await fetch(`/api/admin/faq?companyId=${companyId}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to load FAQ');
    setList(data.faq || []);
  }, [companyId]);

  useEffect(() => { void load(); }, [load]);

  async function addFaq(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/faq', { method: 'POST', body: JSON.stringify({ ...form, companyId }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to add FAQ');
    setForm({ question: '', approved_answer: '', tags: '' });
    void load();
  }


  async function edit(item: FAQ) {
    const question = prompt('Question', item.question) || item.question;
    const approved_answer = prompt('Approved answer', item.approved_answer) || item.approved_answer;
    const tags = prompt('Tags', item.tags || '') || '';
    const res = await fetch(`/api/admin/faq/${item.id}`, { method: 'PATCH', body: JSON.stringify({ question, approved_answer, tags }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to update FAQ');
    void load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to delete FAQ');
    void load();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>FAQ / SOP</h2>
        <CompanySelector defaultCompanyId={process.env.NEXT_PUBLIC_DEFAULT_COMPANY_ID} onChange={setCompanyId} />
        <ErrorBanner message={error} />
        <form className="grid" onSubmit={addFaq}>
          <input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <textarea rows={3} placeholder="Approved answer" value={form.approved_answer} onChange={(e) => setForm({ ...form, approved_answer: e.target.value })} />
          <input placeholder="Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <button type="submit" disabled={!companyId}>Add FAQ</button>
        </form>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Question</th><th>Answer</th><th>Tags</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((f) => (
              <tr key={f.id}>
                <td>{f.question}</td>
                <td>{f.approved_answer}</td>
                <td>{f.tags}</td>
                <td style={{ display: 'flex', gap: 8 }}><button className="secondary" onClick={() => edit(f)}>Edit</button><button className="warn" onClick={() => remove(f.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
