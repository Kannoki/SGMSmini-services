import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Micro Frontend Host',
  description: 'Host shell with auth and remote app navigation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

