import { getAuthToken } from './auth';

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

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

export type Cron = {
  id: string;
  name: string;
  code: string;
  letterId: string;
  cronExpression: string;
  recipientEmails: string[] | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type UpsertCronPayload = {
  name: string;
  code: string;
  letterId: string;
  cronExpression: string;
  recipientEmails?: string[];
};

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
