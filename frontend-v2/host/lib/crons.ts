import { getAuthToken } from './auth';
import type { Cron, RequestOptions, UpsertCronPayload } from '../model/cron';

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const token = getAuthToken();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getCrons() {
  return request<Cron[]>('/crons');
}

export function createCron(payload: UpsertCronPayload) {
  return request<Cron>('/cron', { method: 'POST', body: payload });
}

export function updateCron(id: string, payload: Partial<UpsertCronPayload>) {
  return request<Cron>(`/cron/${id}`, { method: 'PATCH', body: payload });
}

export function deleteCron(id: string) {
  return request<boolean>(`/cron/${id}`, { method: 'DELETE' });
}
