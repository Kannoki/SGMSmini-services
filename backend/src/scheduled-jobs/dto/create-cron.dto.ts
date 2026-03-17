import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCronDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsString()
  letterId!: string;

  @ApiProperty({
    description: 'Cron expression, for example: 0 9 * * *',
  })
  @IsString()
  cronExpression!: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Recipient override emails. If omitted, use letter recipients.',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recipientEmails?: string[];
}
