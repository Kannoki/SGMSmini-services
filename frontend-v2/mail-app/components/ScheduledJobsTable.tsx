'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Tag, Typography, message } from 'antd';
import { LETTERS_QUERY } from '@/lib/graphql/letters';
import {
  CREATE_SCHEDULED_JOB,
  DELETE_SCHEDULED_JOB,
  PAUSE_SCHEDULED_JOB,
  RESUME_SCHEDULED_JOB,
  SCHEDULED_JOBS_QUERY,
} from '@/lib/graphql/scheduled-jobs';
import type { Letter, ScheduledJob } from '@/model';

const columnHelper = createColumnHelper<ScheduledJob>();
const parseEmails = (value?: string) => (value ? value.split(/,\s*/).filter(Boolean) : undefined);

export function ScheduledJobsTable() {
  const jobsRes = useQuery(SCHEDULED_JOBS_QUERY);
  const lettersRes = useQuery(LETTERS_QUERY);
  const [createJob] = useMutation(CREATE_SCHEDULED_JOB);
  const [pauseJob] = useMutation(PAUSE_SCHEDULED_JOB);
  const [resumeJob] = useMutation(RESUME_SCHEDULED_JOB);
  const [deleteJob] = useMutation(DELETE_SCHEDULED_JOB);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const jobs = useMemo(() => (jobsRes.data?.scheduledJobs ?? []) as ScheduledJob[], [jobsRes.data]);
  const letters = useMemo(() => (lettersRes.data?.letters ?? []) as Letter[], [lettersRes.data]);

  const handleCreate = async () => {
    const values = await form.validateFields();
    await createJob({
      variables: {
        input: {
          letterId: values.letterId,
          cronExpression: values.cronExpression,
          recipientEmails: parseEmails(values.recipientEmails),
        },
      },
    });
    await jobsRes.refetch();
    form.resetFields();
    setModalOpen(false);
    message.success('Scheduled job created');
  };

  const handlePauseResume = async (job: ScheduledJob) => {
    if (job.status === 'ACTIVE') {
      await pauseJob({ variables: { id: job.id } });
      message.success('Job paused');
    } else {
      await resumeJob({ variables: { id: job.id } });
      message.success('Job resumed');
    }
    await jobsRes.refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteJob({ variables: { id } });
    await jobsRes.refetch();
    message.success('Job deleted');
  };

  const columns = [
    columnHelper.accessor((row) => row.letter?.subject ?? '-', {
      id: 'letter',
      header: 'Letter',
    }),
    columnHelper.accessor('cronExpression', { header: 'Cron' }),
    columnHelper.accessor('recipientEmails', {
      header: 'Recipients Override',
      cell: ({ getValue }) => (getValue() ?? []).join(', ') || '(letter default)',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => <Tag color={getValue() === 'ACTIVE' ? 'green' : 'orange'}>{getValue()}</Tag>,
    }),
    columnHelper.accessor('lastRunAt', {
      header: 'Last Run',
      cell: ({ getValue }) => (getValue() ? new Date(getValue() as string).toLocaleString() : '-'),
    }),
    columnHelper.accessor('nextRunAt', {
      header: 'Next Run',
      cell: ({ getValue }) => (getValue() ? new Date(getValue() as string).toLocaleString() : '-'),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const job = row.original;
        return (
          <Space>
            <Button size="small" onClick={() => handlePauseResume(job)}>
              {job.status === 'ACTIVE' ? 'Pause' : 'Resume'}
            </Button>
            <Popconfirm title="Delete this job?" onConfirm={() => handleDelete(job.id)}>
              <Button size="small" danger>Delete</Button>
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

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Scheduled Jobs</Typography.Title>
        <Button type="primary" onClick={() => setModalOpen(true)}>New Job</Button>
      </Space>
      <div style={{ background: '#fff', borderRadius: 8, padding: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {jobsRes.loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 16 }}>Loading...</td>
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
      </div>

      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleCreate}
        title="Create Scheduled Job"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="letterId" label="Letter" rules={[{ required: true }]}>
            <Select options={letters.map((l) => ({ label: l.subject, value: l.id }))} />
          </Form.Item>
          <Form.Item name="cronExpression" label="Cron Expression" rules={[{ required: true }]}>
            <Input placeholder="0 9 * * *" />
          </Form.Item>
          <Form.Item name="recipientEmails" label="Recipients Override (comma separated)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

