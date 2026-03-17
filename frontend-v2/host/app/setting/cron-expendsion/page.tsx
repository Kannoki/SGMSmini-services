'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { createCron, deleteCron, getCrons, type Cron, updateCron } from '../../../lib/crons';

type CronForm = {
  name: string;
  code: string;
  letterId: string;
  cronExpression: string;
  recipientEmails: string;
};

const initialForm: CronForm = {
  name: '',
  code: '',
  letterId: '',
  cronExpression: '',
  recipientEmails: '',
};

export default function CronExpendsionPage() {
  const [crons, setCrons] = useState<Cron[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCron, setEditingCron] = useState<Cron | null>(null);
  const [form, setForm] = useState<CronForm>(initialForm);

  const sortedCrons = useMemo(
    () =>
      [...crons].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [crons],
  );

  const loadCrons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCrons();
      setCrons(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load crons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCrons();
  }, []);

  const openCreateModal = () => {
    setEditingCron(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (cron: Cron) => {
    setEditingCron(cron);
    setForm({
      name: cron.name,
      code: cron.code,
      letterId: cron.letterId,
      cronExpression: cron.cronExpression,
      recipientEmails: (cron.recipientEmails || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCron(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      letterId: form.letterId.trim(),
      cronExpression: form.cronExpression.trim(),
      recipientEmails: form.recipientEmails
        ? form.recipientEmails.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined,
    };

    try {
      if (editingCron) {
        await updateCron(editingCron.id, payload);
      } else {
        await createCron(payload);
      }
      await loadCrons();
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save cron');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this cron?');
    if (!confirmed) {
      return;
    }
    setError(null);
    try {
      await deleteCron(id);
      await loadCrons();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete cron');
    }
  };

  const exportExcel = () => {
    const rows = sortedCrons.map((item, index) => ({
      STT: index + 1,
      Ten: item.name,
      MaCron: item.code,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ClonManager');
    XLSX.writeFile(workbook, 'clon-manager.xlsx');
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clon Manager</h1>
          <p className="text-sm text-slate-300">Quan ly cron phuc vu toan bo ung dung Letter.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportExcel}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
          >
            Export Excel
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
          >
            Tao
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-left text-sm text-slate-200">
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Ten</th>
              <th className="px-4 py-3">Ma cron</th>
              <th className="px-4 py-3">Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-slate-300">
                  Dang tai du lieu...
                </td>
              </tr>
            ) : sortedCrons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-slate-300">
                  Chua co cron nao.
                </td>
              </tr>
            ) : (
              sortedCrons.map((cron, index) => (
                <tr key={cron.id} className="border-t border-slate-800 text-sm text-slate-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{cron.name}</td>
                  <td className="px-4 py-3">{cron.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(cron)}
                        className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
                      >
                        Sua
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(cron.id)}
                        className="rounded border border-rose-500/50 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
                      >
                        Xoa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-slate-100">{editingCron ? 'Cap nhat cron' : 'Tao cron'}</h2>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-300">
                  <span>Ten</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-300">
                  <span>Ma cron</span>
                  <input
                    required
                    value={form.code}
                    onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                  />
                </label>
              </div>
              <label className="space-y-1 text-sm text-slate-300">
                <span>Letter ID</span>
                <input
                  required
                  value={form.letterId}
                  onChange={(event) => setForm((prev) => ({ ...prev, letterId: event.target.value }))}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-300">
                <span>Cron expression</span>
                <input
                  required
                  placeholder="0 9 * * *"
                  value={form.cronExpression}
                  onChange={(event) => setForm((prev) => ({ ...prev, cronExpression: event.target.value }))}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-300">
                <span>Recipient emails (comma separated)</span>
                <input
                  value={form.recipientEmails}
                  onChange={(event) => setForm((prev) => ({ ...prev, recipientEmails: event.target.value }))}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Dang luu...' : 'Luu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
