import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'CleanOps Onboarding',
  description: 'SMS-first new hire onboarding for cleaning businesses'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h1>CleanOps Onboarding</h1>
            <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Link href="/owner/hires">Hires</Link>
              <Link href="/owner/faq">FAQ</Link>
              <Link href="/login">Login</Link>
            </nav>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
