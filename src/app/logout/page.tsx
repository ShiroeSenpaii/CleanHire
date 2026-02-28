'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    }
    void run();
  }, [router]);

  return <div className="card">Logging out...</div>;
}
