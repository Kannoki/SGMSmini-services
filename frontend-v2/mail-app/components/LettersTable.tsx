'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button, Form, Input, Modal, Popconfirm, Space, Tag, Typography, message } from 'antd';
import {
  CREATE_LETTER,
  DELETE_LETTER,
  LETTERS_QUERY,
  SEND_LETTER_NOW,
  UPDATE_LETTER,
} from '@/lib/graphql/letters';
import type { Letter } from '@/types';

const { TextArea } = Input;
const columnHelper = createColumnHelper<Letter>();
const parseEmails = (value?: string) => (value ? value.split(/,\s*/).filter(Boolean) : []);

export function LettersTable() {
  const { data, loading, refetch } = useQuery(LETTERS_QUERY);
  const [createLetter] = useMutation(CREATE_LETTER);
  const [updateLetter] = useMutation(UPDATE_LETTER);
  const [deleteLetter] = useMutation(DELETE_LETTER);
  const [sendLetterNow] = useMutation(SEND_LETTER_NOW);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Letter | null>(null);
  const [form] = Form.useForm();

  const letters = useMemo(() => (data?.letters ?? []) as Letter[], [data]);

  const handleDelete = async (id: string) => {
    await deleteLetter({ variables: { id } });
    await refetch();
    message.success('Letter deleted');
  };

  const handleSendNow = async (letter: Letter) => {
    const recipients = letter.recipientEmails;
    if (!recipients?.length) {
      message.error('No recipients on this letter');
      return;
    }
    await sendLetterNow({ variables: { letterId: letter.id, recipients } });
    await refetch();
    message.success('Letter sent');
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const input = {
      subject: values.subject,
      body: values.body,
      recipientEmails: parseEmails(values.recipientEmails),
    };
    if (editing) {
      await updateLetter({ variables: { id: editing.id, input } });
      message.success('Letter updated');
    } else {
      await createLetter({ variables: { input } });
      message.success('Letter created');
    }
    setEditing(null);
    setModalOpen(false);
    form.resetFields();
    await refetch();
  };

  const columns = [
    columnHelper.accessor('subject', { header: 'Subject' }),
    columnHelper.accessor('recipientEmails', {
      header: 'Recipients',
      cell: ({ getValue }) => (getValue() ?? []).join(', '),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const color = status === 'SENT' ? 'green' : status === 'FAILED' ? 'red' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const letter = row.original;
        return (
          <Space>
            <Button size="small" onClick={() => handleSendNow(letter)}>Send Now</Button>
            <Button
              size="small"
              onClick={() => {
                setEditing(letter);
                form.setFieldsValue({
                  subject: letter.subject,
                  body: letter.body,
                  recipientEmails: letter.recipientEmails.join(', '),
                });
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Popconfirm title="Delete this letter?" onConfirm={() => handleDelete(letter.id)}>
              <Button size="small" danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: letters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Letters</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          New Letter
        </Button>
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
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 16 }}>Loading...</td>
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
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        title={editing ? 'Edit Letter' : 'Create Letter'}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Body (HTML)" name="body" rules={[{ required: true }]}>
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item label="Recipients (comma separated)" name="recipientEmails">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

