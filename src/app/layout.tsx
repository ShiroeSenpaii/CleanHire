import './globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { OWNER_SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';
import { env } from '@/lib/env';

export const metadata = {
  title: 'CleanOps Onboarding',
  description: 'SMS-first new hire onboarding for cleaning businesses'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(OWNER_SESSION_COOKIE)?.value;
  const isAuthed = verifySessionToken(token);

  return (
    <html lang="en">
      <body>
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
            <h1>CleanOps Onboarding</h1>
            <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {isAuthed && (
                <>
                  <Link href="/companies">Companies</Link>
                  <Link href="/hires">Hires</Link>
                  <Link href="/faq">FAQ</Link>
                </>
              )}
              {!env.DEFAULT_COMPANY_ID && <span id="company-selector-root" />}
              {isAuthed ? <Link href="/logout">Logout</Link> : <Link href="/login">Login</Link>}
            </nav>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
