'use client';

import { useSearchParams } from 'next/navigation';
import { Layout } from 'antd';
import Link from 'next/link';
import { ScheduledJobsTable } from '@/components/ScheduledJobsTable';

const { Header, Content } = Layout;

export default function ScheduledPage() {
  const searchParams = useSearchParams();
  const letterId = searchParams.get('letterId');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/letters" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Letters
        </Link>
        <Link href="/scheduled" style={{ color: 'white', fontWeight: 600 }}>
          Scheduled Jobs
        </Link>
        <span style={{ color: 'white', marginLeft: 'auto' }}>Mail Sender Manager</span>
      </Header>
      <Content style={{ padding: 24 }}>
        <ScheduledJobsTable defaultLetterId={letterId} />
      </Content>
    </Layout>
  );
}
