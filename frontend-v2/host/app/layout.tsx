import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Micro Frontend Portfolio',
  description: 'Host shell for micro frontend demo (Portfolio, Product, Contact)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18)_0,_transparent_55%)]" />
          <Navbar />
          <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-10 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

