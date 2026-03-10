import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { ScheduledJob } from './scheduled-job.model';
import { CreateScheduledJobInput } from './dto/create-scheduled-job.input';
import { UpdateScheduledJobInput } from './dto/update-scheduled-job.input';

@Resolver(() => ScheduledJob)
export class ScheduledJobsResolver {
  constructor(private scheduledJobsService: ScheduledJobsService) {}

  @Query(() => [ScheduledJob])
  scheduledJobs() {
    return this.scheduledJobsService.findAll();
  }

  @Query(() => ScheduledJob, { nullable: true })
  scheduledJob(@Args('id', { type: () => ID }) id: string) {
    return this.scheduledJobsService.findOne(id);
  }

  @Mutation(() => ScheduledJob)
  createScheduledJob(@Args('input') input: CreateScheduledJobInput) {
    return this.scheduledJobsService.create(input);
  }

  @Mutation(() => ScheduledJob)
  updateScheduledJob(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateScheduledJobInput,
  ) {
    return this.scheduledJobsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteScheduledJob(@Args('id', { type: () => ID }) id: string) {
    await this.scheduledJobsService.remove(id);
    return true;
  }

  @Mutation(() => ScheduledJob)
  pauseScheduledJob(@Args('id', { type: () => ID }) id: string) {
    return this.scheduledJobsService.pause(id);
  }

  @Mutation(() => ScheduledJob)
  resumeScheduledJob(@Args('id', { type: () => ID }) id: string) {
    return this.scheduledJobsService.resume(id);
  }
}
