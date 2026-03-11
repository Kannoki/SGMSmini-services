import type { Metadata } from 'next';
import Link from 'next/link';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mail Manager MFE',
  description: 'Micro-frontend for Mail Sender Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
            <aside
              style={{
                width: 240,
                background: '#001529',
                color: '#fff',
                padding: 16,
              }}
            >
              <h2 style={{ color: '#fff', fontSize: 18, marginBottom: 16 }}>Mail Manager</h2>
              <nav style={{ display: 'grid', gap: 8 }}>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/letters" className="nav-link">Letters</Link>
                <Link href="/jobs" className="nav-link">Jobs</Link>
                <Link href="/history" className="nav-link">History</Link>
              </nav>
            </aside>
            <main style={{ flex: 1, padding: 24 }}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
