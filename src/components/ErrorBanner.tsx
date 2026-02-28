'use client';

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return <div style={{ background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 12 }}>{message}</div>;
}
