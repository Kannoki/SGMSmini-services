import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Letter {
  @Field(() => ID)
  id: string;

  @Field()
  subject: string;

  @Field()
  body: string;

  @Field(() => [String])
  recipientEmails: string[];

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
