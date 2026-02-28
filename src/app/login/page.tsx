'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorBanner } from '@/components/ErrorBanner';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const next = useSearchParams().get('next') || '/hires';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ passcode }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Login failed');
    router.push(next);
    router.refresh();
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Owner Login</h2>
      <ErrorBanner message={error} />
      <form onSubmit={onSubmit} className="grid">
        <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
