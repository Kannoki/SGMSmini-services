import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Letter } from '../letters/letter.model';

@ObjectType()
export class ScheduledJob {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  letterId: string;

  @Field(() => Letter)
  letter: Letter;

  @Field()
  cronExpression: string;

  @Field(() => [String], { nullable: true })
  recipientEmails: string[] | null;

  @Field()
  status: string;

  @Field({ nullable: true })
  lastRunAt: Date | null;

  @Field({ nullable: true })
  nextRunAt: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
