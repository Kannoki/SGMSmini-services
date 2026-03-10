import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as cronParser from 'cron-parser';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronManagerService implements OnModuleInit {
  constructor(
    private scheduler: SchedulerRegistry,
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async onModuleInit() {
    const jobs = await this.prisma.scheduledJob.findMany({
      where: { status: 'ACTIVE' },
      include: { letter: true },
    });
    for (const job of jobs) {
      this.registerJob(job.id);
    }
  }

  async registerJob(jobId: string) {
    const name = `job-${jobId}`;
    try {
      this.scheduler.deleteCronJob(name);
    } catch {
      // ignore if not exists
    }
    const j = await this.prisma.scheduledJob.findUnique({ where: { id: jobId } });
    if (!j || j.status !== 'ACTIVE') return;
    const cronJob = new CronJob(
      j.cronExpression,
      () => this.executeJob(jobId),
      null,
      true,
    );
    this.scheduler.addCronJob(name, cronJob);
  }

  unregisterJob(jobId: string) {
    const name = `job-${jobId}`;
    try {
      this.scheduler.deleteCronJob(name);
    } catch {
      // ignore
    }
  }

  private async getCronExpression(jobId: string): Promise<string> {
    const j = await this.prisma.scheduledJob.findUnique({ where: { id: jobId } });
    if (!j) throw new Error('Job not found');
    return j.cronExpression;
  }

  private async executeJob(jobId: string) {
    const job = await this.prisma.scheduledJob.findUnique({
      where: { id: jobId },
      include: { letter: true },
    });
    if (!job || job.status !== 'ACTIVE') return;
    const recipients = job.recipientEmails
      ? (JSON.parse(job.recipientEmails) as string[])
      : (JSON.parse(job.letter.recipientEmails || '[]') as string[]);
    if (recipients.length === 0) return;
    const result = await this.mail.sendMail({
      to: recipients,
      subject: job.letter.subject,
      html: job.letter.body,
    });
    await this.prisma.scheduledJob.update({
      where: { id: jobId },
      data: { lastRunAt: new Date() },
    });
    if (result.success) {
      await this.prisma.letter.update({
        where: { id: job.letterId },
        data: { status: 'SENT' },
      });
    }
  }

  static getNextRun(cronExpression: string): Date | null {
    try {
      const interval = cronParser.parseExpression(cronExpression);
      return interval.next().toDate();
    } catch {
      return null;
    }
  }
}
