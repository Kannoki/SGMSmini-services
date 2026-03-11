import { NextResponse } from 'next/server';

const appConfigs = [
  {
    id: 'mail',
    url: process.env.MAIL_APP_URL || 'http://localhost:3002',
    probePath: '/mail',
  },
  {
    id: 'portfolio',
    url: process.env.PORTFOLIO_APP_URL || 'http://localhost:3001',
    probePath: '/portfolio',
  },
];

export async function GET() {
  const checks = await Promise.all(
    appConfigs.map(async (app) => {
      const endpoint = `${app.url}${app.probePath}`;
      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          cache: 'no-store',
          redirect: 'manual',
        });
        return { id: app.id, available: res.status < 500 };
      } catch {
        return { id: app.id, available: false };
      }
    }),
  );

  return NextResponse.json({ apps: checks });
}
