import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateScheduledJobInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  code?: string;

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
