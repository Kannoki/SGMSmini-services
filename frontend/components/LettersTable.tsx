'use client';

import { useQuery, useMutation } from '@apollo/client';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Link from 'next/link';
import {
  LETTERS_QUERY,
  CREATE_LETTER,
  UPDATE_LETTER,
  DELETE_LETTER,
  SEND_LETTER_NOW,
} from '@/lib/graphql/letters';
import type { Letter } from '@/types';

const { TextArea } = Input;
const columnHelper = createColumnHelper<Letter>();

export function LettersTable() {
  const { data, loading, refetch } = useQuery(LETTERS_QUERY);
  const [createLetter] = useMutation(CREATE_LETTER, {
    refetchQueries: [{ query: LETTERS_QUERY }],
  });
  const [updateLetter] = useMutation(UPDATE_LETTER, {
    refetchQueries: [{ query: LETTERS_QUERY }],
  });
  const [deleteLetter] = useMutation(DELETE_LETTER, {
    refetchQueries: [{ query: LETTERS_QUERY }],
  });
  const [sendLetterNow] = useMutation(SEND_LETTER_NOW, {
    refetchQueries: [{ query: LETTERS_QUERY }],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Letter | null>(null);
  const [form] = Form.useForm();

  // #region agent log
  fetch('http://127.0.0.1:7701/ingest/f1c9f799-d8f7-41a5-8476-5b07a41deac5', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': 'e94476',
    },
    body: JSON.stringify({
      sessionId: 'e94476',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'LettersTable.tsx:35',
      message: 'LettersTable render',
      data: { hasData: !!data, loading },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const letters = (data?.letters ?? []) as Letter[];

  const columns = [
    columnHelper.accessor('subject', { header: 'Subject' }),
    columnHelper.accessor('recipientEmails', {
      header: 'Recipients',
      cell: ({ getValue }) => (getValue() as string[]).join(', ') || '-',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as string;
        const color = s === 'SENT' ? 'green' : s === 'FAILED' ? 'red' : 'default';
        return <Tag color={color}>{s}</Tag>;
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const letter = row.original;
        return (
          <Space>
            <Button type="link" size="small" icon={<SendOutlined />} onClick={() => handleSend(letter)}>
              Send Now
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(letter);
                form.setFieldsValue({
                  subject: letter.subject,
                  body: letter.body,
                  recipientEmails: letter.recipientEmails?.join(', '),
                });
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Link href={`/scheduled?letterId=${letter.id}`}>
              <Button type="link" size="small" icon={<CalendarOutlined />}>
                Schedule
              </Button>
            </Link>
            <Popconfirm title="Delete this letter?" onConfirm={() => handleDelete(letter.id)}>
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
    data: letters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const recipientEmails = values.recipientEmails
      ? values.recipientEmails.split(/,\s*/).filter(Boolean)
      : [];
    try {
      if (editing) {
        await updateLetter({
          variables: {
            id: editing.id,
            input: {
              subject: values.subject,
              body: values.body,
              recipientEmails,
            },
          },
        });
        message.success('Letter updated');
      } else {
        await createLetter({
          variables: {
            input: { subject: values.subject, body: values.body, recipientEmails },
          },
        });
        message.success('Letter created');
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      refetch();
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLetter({ variables: { id } });
      message.success('Letter deleted');
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  const handleSend = async (letter: Letter) => {
    const recipients = letter.recipientEmails;
    if (!recipients?.length) {
      message.error('No recipients');
      return;
    }
    try {
      await sendLetterNow({ variables: { letterId: letter.id, recipients } });
      message.success('Letter sent');
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
            setEditing(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          New Letter
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
            <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center' }}>Loading...</td></tr>
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
        title={editing ? 'Edit Letter' : 'New Letter'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input placeholder="Email subject" />
          </Form.Item>
          <Form.Item name="body" label="Body (HTML)" rules={[{ required: true }]}>
            <TextArea rows={6} placeholder="Email body (HTML supported)" />
          </Form.Item>
          <Form.Item
            name="recipientEmails"
            label="Recipients (comma-separated)"
          >
            <Input placeholder="a@example.com, b@example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
