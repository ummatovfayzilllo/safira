import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LastActivityService } from './last_activity.service';
import { CreateLastActivityDto } from './dto/create-last_activity.dto';
import { UpdateLastActivityDto } from './dto/update-last_activity.dto';

@Controller('last-activity')
export class LastActivityController {
  constructor(private readonly lastActivityService: LastActivityService) {}

  @Post()
  create(@Body() createLastActivityDto: CreateLastActivityDto) {
    return this.lastActivityService.create(createLastActivityDto);
  }

  @Get()
  findAll() {
    return this.lastActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lastActivityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLastActivityDto: UpdateLastActivityDto,
  ) {
    return this.lastActivityService.update(id, updateLastActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lastActivityService.remove(id);
  }
}
