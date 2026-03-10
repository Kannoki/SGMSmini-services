import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateScheduledJobInput {
  @Field()
  @IsString()
  letterId: string;

  @Field()
  @IsString()
  cronExpression: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  recipientEmails?: string[];
}
