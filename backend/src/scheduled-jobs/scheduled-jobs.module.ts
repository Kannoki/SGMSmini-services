import { Module } from '@nestjs/common';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { ScheduledJobsResolver } from './scheduled-jobs.resolver';
import { CronManagerService } from './cron-manager.service';
import { MailModule } from '../mail/mail.module';
import { CronsController } from './crons.controller';

@Module({
  imports: [MailModule],
  controllers: [CronsController],
  providers: [ScheduledJobsService, ScheduledJobsResolver, CronManagerService],
})
export class ScheduledJobsModule {}
