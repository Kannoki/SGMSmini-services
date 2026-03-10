'use client';

import { Layout, Typography } from 'antd';
import Link from 'next/link';
import { LettersTable } from '@/components/LettersTable';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function LettersPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/letters" style={{ color: 'white', fontWeight: 600 }}>
          Letters
        </Link>
        <Link href="/scheduled" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Scheduled Jobs
        </Link>
        <Title level={4} style={{ margin: 0, color: 'white' }}>
          Mail Sender Manager
        </Title>
      </Header>
      <Content style={{ padding: 24 }}>
        <LettersTable />
      </Content>
    </Layout>
  );
}
