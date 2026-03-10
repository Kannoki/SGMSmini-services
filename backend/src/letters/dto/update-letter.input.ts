import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class UpdateLetterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  subject?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  body?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  recipientEmails?: string[];
}
