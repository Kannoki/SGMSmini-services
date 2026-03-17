'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Col, Row, Table, Tag, Typography } from 'antd';
import { LETTERS_QUERY } from '@/lib/graphql/letters';
import { SCHEDULED_JOBS_QUERY } from '@/lib/graphql/scheduled-jobs';
import type { Letter, ScheduledJob } from '@/model';

const { Title } = Typography;

export function DashboardOverview() {
  const lettersRes = useQuery(LETTERS_QUERY);
  const jobsRes = useQuery(SCHEDULED_JOBS_QUERY);

  const letters = (lettersRes.data?.letters ?? []) as Letter[];
  const jobs = (jobsRes.data?.scheduledJobs ?? []) as ScheduledJob[];

  const metrics = useMemo(() => {
    const activeJobs = jobs.filter((job) => job.status === 'ACTIVE').length;
    const sentCount = letters.filter((letter) => letter.status === 'SENT').length;
    const failedCount = letters.filter((letter) => letter.status === 'FAILED').length;
    return {
      totalLetters: letters.length,
      activeJobs,
      sentCount,
      failedCount,
    };
  }, [letters, jobs]);

  const recentLetters = [...letters]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map((item) => ({ ...item, key: item.id }));

  return (
    <>
      <Title level={3}>Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card title="Total Letters">{metrics.totalLetters}</Card></Col>
        <Col span={6}><Card title="Active Jobs">{metrics.activeJobs}</Card></Col>
        <Col span={6}><Card title="Sent Letters">{metrics.sentCount}</Card></Col>
        <Col span={6}><Card title="Failed Sends">{metrics.failedCount}</Card></Col>
      </Row>
      <Card title="Recent Activity">
        <Table
          loading={lettersRes.loading || jobsRes.loading}
          dataSource={recentLetters}
          pagination={false}
          columns={[
            { title: 'Subject', dataIndex: 'subject', key: 'subject' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'SENT' ? 'green' : status === 'FAILED' ? 'red' : 'default'}>
                  {status}
                </Tag>
              ),
            },
            {
              title: 'Updated',
              dataIndex: 'updatedAt',
              key: 'updatedAt',
              render: (value: string) => new Date(value).toLocaleString(),
            },
          ]}
        />
      </Card>
    </>
  );
}

