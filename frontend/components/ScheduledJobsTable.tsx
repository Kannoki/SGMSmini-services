'use client';

import { useQuery, useMutation } from '@apollo/client';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, PauseCircleOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import {
  SCHEDULED_JOBS_QUERY,
  CREATE_SCHEDULED_JOB,
  DELETE_SCHEDULED_JOB,
  PAUSE_SCHEDULED_JOB,
  RESUME_SCHEDULED_JOB,
} from '@/lib/graphql/scheduled-jobs';
import { LETTERS_QUERY } from '@/lib/graphql/letters';
import type { ScheduledJob } from '@/types';

const columnHelper = createColumnHelper<ScheduledJob>();

const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at 9am', value: '0 9 * * *' },
  { label: 'Weekly on Monday 9am', value: '0 9 * * 1' },
];

export function ScheduledJobsTable({ defaultLetterId }: { defaultLetterId?: string | null }) {
  const { data: jobsData, loading } = useQuery(SCHEDULED_JOBS_QUERY);
  const { data: lettersData } = useQuery(LETTERS_QUERY);
  const [createJob] = useMutation(CREATE_SCHEDULED_JOB, {
    refetchQueries: [{ query: SCHEDULED_JOBS_QUERY }],
  });
  const [deleteJob] = useMutation(DELETE_SCHEDULED_JOB, {
    refetchQueries: [{ query: SCHEDULED_JOBS_QUERY }],
  });
  const [pauseJob] = useMutation(PAUSE_SCHEDULED_JOB, {
    refetchQueries: [{ query: SCHEDULED_JOBS_QUERY }],
  });
  const [resumeJob] = useMutation(RESUME_SCHEDULED_JOB, {
    refetchQueries: [{ query: SCHEDULED_JOBS_QUERY }],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const jobs = (jobsData?.scheduledJobs ?? []) as ScheduledJob[];
  const letters = (lettersData?.letters ?? []) as { id: string; subject: string }[];

  useEffect(() => {
    if (defaultLetterId && modalOpen) {
      form.setFieldValue('letterId', defaultLetterId);
    }
  }, [defaultLetterId, modalOpen, form]);

  const columns = [
    columnHelper.accessor((r) => r.letter?.subject, {
      header: 'Letter',
      cell: ({ row }) => row.original.letter?.subject ?? '-',
    }),
    columnHelper.accessor('cronExpression', { header: 'Cron' }),
    columnHelper.accessor('recipientEmails', {
      header: 'Recipients',
      cell: ({ getValue }) => {
        const v = getValue();
        return v && Array.isArray(v) ? v.join(', ') : '(from letter)';
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as string;
        const color = s === 'ACTIVE' ? 'green' : s === 'PAUSED' ? 'orange' : 'default';
        return <Tag color={color}>{s}</Tag>;
      },
    }),
    columnHelper.accessor('lastRunAt', {
      header: 'Last Run',
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? new Date(v as string).toLocaleString() : '-';
      },
    }),
    columnHelper.accessor('nextRunAt', {
      header: 'Next Run',
      cell: ({ getValue }) => {
        const v = getValue();
        return v ? new Date(v as string).toLocaleString() : '-';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <Space>
            {job.status === 'ACTIVE' ? (
              <Button
                type="link"
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => handlePause(job.id)}
              >
                Pause
              </Button>
            ) : (
              <Button
                type="link"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleResume(job.id)}
              >
                Resume
              </Button>
            )}
            <Popconfirm title="Delete this job?" onConfirm={() => handleDelete(job.id)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const recipientEmails = values.recipientEmails
      ? values.recipientEmails.split(/,\s*/).filter(Boolean)
      : undefined;
    try {
      await createJob({
        variables: {
          input: {
            letterId: values.letterId,
            cronExpression: values.cronExpression,
            recipientEmails,
          },
        },
      });
      message.success('Scheduled job created');
      setModalOpen(false);
      form.resetFields();
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob({ variables: { id } });
      message.success('Job deleted');
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  const handlePause = async (id: string) => {
    try {
      await pauseJob({ variables: { id } });
      message.success('Job paused');
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  const handleResume = async (id: string) => {
    try {
      await resumeJob({ variables: { id } });
      message.success('Job resumed');
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.setFieldsValue({ letterId: defaultLetterId ?? undefined });
            setModalOpen(true);
          }}
        >
          New Scheduled Job
        </Button>
      </Space>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ padding: 24, textAlign: 'center' }}>
                Loading...
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal
        title="New Scheduled Job"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="letterId" label="Letter" rules={[{ required: true }]}>
            <Select
              placeholder="Select letter"
              options={letters.map((l) => ({ label: l.subject, value: l.id }))}
            />
          </Form.Item>
          <Form.Item
            name="cronExpression"
            label="Cron Expression"
            rules={[{ required: true }]}
            extra="Format: minute hour day month weekday (e.g. 0 9 * * * = daily 9am)"
          >
            <Select
              placeholder="Select preset"
              options={CRON_PRESETS}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="recipientEmails" label="Recipients override (comma-separated, optional)">
            <Input placeholder="Leave empty to use letter recipients" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
