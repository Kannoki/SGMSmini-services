export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

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

