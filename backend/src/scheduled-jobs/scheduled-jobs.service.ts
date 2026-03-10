import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CronManagerService } from './cron-manager.service';
import { CreateScheduledJobInput } from './dto/create-scheduled-job.input';
import { UpdateScheduledJobInput } from './dto/update-scheduled-job.input';

@Injectable()
export class ScheduledJobsService {
  constructor(
    private prisma: PrismaService,
    private cronManager: CronManagerService,
  ) {}

  private mapRow(row: {
    recipientEmails: string | null;
    letter?: { recipientEmails: string; [k: string]: unknown };
    [k: string]: unknown;
  }) {
    const out: Record<string, unknown> = {
      ...row,
      recipientEmails: row.recipientEmails ? (JSON.parse(row.recipientEmails) as string[]) : null,
    };
    if (row.letter) {
      out.letter = {
        ...row.letter,
        recipientEmails: JSON.parse(row.letter.recipientEmails || '[]') as string[],
      };
    }
    return out;
  }

  async findAll() {
    const rows = await this.prisma.scheduledJob.findMany({
      include: { letter: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      ...r,
      recipientEmails: r.recipientEmails ? (JSON.parse(r.recipientEmails) as string[]) : null,
    }));
  }

  async findOne(id: string) {
    const row = await this.prisma.scheduledJob.findUnique({
      where: { id },
      include: { letter: true },
    });
    if (!row) return null;
    return this.mapRow(row);
  }

  async create(input: CreateScheduledJobInput) {
    const nextRunAt = CronManagerService.getNextRun(input.cronExpression);
    const row = await this.prisma.scheduledJob.create({
      data: {
        letterId: input.letterId,
        cronExpression: input.cronExpression,
        recipientEmails: input.recipientEmails
          ? JSON.stringify(input.recipientEmails)
          : null,
        nextRunAt,
      },
      include: { letter: true },
    });
    await this.cronManager.registerJob(row.id);
    return this.mapRow(row);
  }

  async update(id: string, input: UpdateScheduledJobInput) {
    const data: Record<string, unknown> = {};
    if (input.cronExpression != null) {
      data.cronExpression = input.cronExpression;
      data.nextRunAt = CronManagerService.getNextRun(input.cronExpression);
    }
    if (input.recipientEmails != null) data.recipientEmails = JSON.stringify(input.recipientEmails);
    const row = await this.prisma.scheduledJob.update({
      where: { id },
      data,
      include: { letter: true },
    });
    await this.cronManager.registerJob(row.id);
    return this.mapRow(row);
  }

  async remove(id: string) {
    this.cronManager.unregisterJob(id);
    await this.prisma.scheduledJob.delete({ where: { id } });
    return true;
  }

  async pause(id: string) {
    const row = await this.prisma.scheduledJob.update({
      where: { id },
      data: { status: 'PAUSED' },
      include: { letter: true },
    });
    this.cronManager.unregisterJob(id);
    return this.mapRow(row);
  }

  async resume(id: string) {
    const row = await this.prisma.scheduledJob.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: { letter: true },
    });
    await this.cronManager.registerJob(id);
    return this.mapRow(row);
  }
}
