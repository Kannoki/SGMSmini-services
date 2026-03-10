export interface Letter {
  id: string;
  subject: string;
  body: string;
  recipientEmails: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledJob {
  id: string;
  letterId: string;
  letter: { id: string; subject: string };
  cronExpression: string;
  recipientEmails: string[] | null;
  status: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}
