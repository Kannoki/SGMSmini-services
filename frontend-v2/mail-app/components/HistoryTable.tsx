'use client';

import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button, Space, Tag, Typography, message } from 'antd';
import { LETTERS_QUERY, SEND_LETTER_NOW } from '@/lib/graphql/letters';
import type { Letter } from '@/model';

const columnHelper = createColumnHelper<Letter>();

export function HistoryTable() {
  const { data, loading, refetch } = useQuery(LETTERS_QUERY);
  const [sendLetterNow] = useMutation(SEND_LETTER_NOW);

  const historyRows = useMemo(() => {
    const letters = (data?.letters ?? []) as Letter[];
    return letters
      .filter((item) => item.status === 'SENT' || item.status === 'FAILED')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [data]);

  const handleResend = async (letter: Letter) => {
    if (!letter.recipientEmails?.length) {
      message.error('No recipients available');
      return;
    }
    await sendLetterNow({ variables: { letterId: letter.id, recipients: letter.recipientEmails } });
    await refetch();
    message.success('Resend requested');
  };

  const columns = [
    columnHelper.accessor('subject', { header: 'Subject' }),
    columnHelper.accessor('recipientEmails', {
      header: 'Recipients',
      cell: ({ getValue }) => (getValue() ?? []).join(', '),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => <Tag color={getValue() === 'SENT' ? 'green' : 'red'}>{getValue()}</Tag>,
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Last Updated',
      cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Space>
          <Button size="small" onClick={() => handleResend(row.original)}>Resend</Button>
        </Space>
      ),
    }),
  ];

  const table = useReactTable({
    data: historyRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Typography.Title level={3} style={{ marginTop: 0 }}>Send History</Typography.Title>
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
    </>
  );
}

