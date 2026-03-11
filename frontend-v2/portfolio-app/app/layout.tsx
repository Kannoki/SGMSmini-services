import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio | Micro Frontend',
  description: 'Personal portfolio page for the micro frontend demo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hostBaseUrl = process.env.NEXT_PUBLIC_HOST_BASE_URL || 'http://localhost:3000';

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm">
            <Link href={`${hostBaseUrl}/dashboard`} className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800">
              User Dashboard Page
            </Link>
            <Link href={`${hostBaseUrl}/portfolio`} className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800">
              Portfolio
            </Link>
            <Link href={`${hostBaseUrl}/mail`} className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800">
              Mail Manager
            </Link>
            <Link href={`${hostBaseUrl}/setting`} className="rounded-md border border-slate-700 px-3 py-1.5 hover:bg-slate-800">
              Setting
            </Link>
          </header>
          <main className="flex min-h-0 flex-1 flex-col gap-10">{children}</main>
        </div>
      </body>
    </html>
  );
}

