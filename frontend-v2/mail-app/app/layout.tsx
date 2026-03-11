import type { Metadata } from 'next';
import Link from 'next/link';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mail Manager MFE',
  description: 'Micro-frontend for Mail Sender Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hostBaseUrl = process.env.NEXT_PUBLIC_HOST_BASE_URL || 'http://localhost:3000';

  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 20px',
                background: '#001529',
                color: '#fff',
              }}
            >
              <div style={{ fontWeight: 700 }}>Mail Manager</div>
              <nav style={{ display: 'flex', gap: 12 }}>
                <Link href={`${hostBaseUrl}/dashboard`} className="nav-link">User Dashboard Page</Link>
                <Link href={`${hostBaseUrl}/portfolio`} className="nav-link">Portfolio</Link>
                <Link href={`${hostBaseUrl}/mail`} className="nav-link">Mail Manager</Link>
                <Link href={`${hostBaseUrl}/setting`} className="nav-link">Setting</Link>
              </nav>
            </header>

            <div style={{ padding: '12px 20px', borderBottom: '1px solid #d9d9d9', background: '#fff' }}>
              <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/dashboard" className="tab-link">Dashboard</Link>
                <Link href="/letters" className="tab-link">Letters</Link>
                <Link href="/jobs" className="tab-link">Jobs</Link>
                <Link href="/history" className="tab-link">History</Link>
              </nav>
            </div>

            <main style={{ padding: 24 }}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
