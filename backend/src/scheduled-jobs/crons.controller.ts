import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { CreateCronDto } from './dto/create-cron.dto';
import { UpdateCronDto } from './dto/update-cron.dto';

@ApiTags('cron')
@Controller()
export class CronsController {
  constructor(private readonly scheduledJobsService: ScheduledJobsService) {}

  @Get('crons')
  @ApiOperation({ summary: 'List all cron jobs' })
  findAll() {
    return this.scheduledJobsService.findAll();
  }

  @Get('cron/:id')
  @ApiOperation({ summary: 'Get one cron job by id' })
  findOne(@Param('id') id: string) {
    return this.scheduledJobsService.findOne(id);
  }

  @Post('cron')
  @ApiOperation({ summary: 'Create a cron job' })
  @ApiBody({ type: CreateCronDto })
  create(@Body() body: CreateCronDto) {
    return this.scheduledJobsService.create(body);
  }

  @Patch('cron/:id')
  @ApiOperation({ summary: 'Update a cron job' })
  @ApiBody({ type: UpdateCronDto })
  update(@Param('id') id: string, @Body() body: UpdateCronDto) {
    return this.scheduledJobsService.update(id, body);
  }

  @Delete('cron/:id')
  @ApiOperation({ summary: 'Delete a cron job' })
  remove(@Param('id') id: string) {
    return this.scheduledJobsService.remove(id);
  }
}
