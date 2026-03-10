import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateLetterInput {
  @Field()
  @IsString()
  subject: string;

  @Field()
  @IsString()
  body: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsOptional()
  recipientEmails?: string[];
}
