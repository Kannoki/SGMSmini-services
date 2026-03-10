import { Module } from '@nestjs/common';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { ScheduledJobsResolver } from './scheduled-jobs.resolver';
import { CronManagerService } from './cron-manager.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [ScheduledJobsService, ScheduledJobsResolver, CronManagerService],
})
export class ScheduledJobsModule {}
