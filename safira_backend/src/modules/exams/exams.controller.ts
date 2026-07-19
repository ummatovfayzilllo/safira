import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('create')
  create(@Body() data: CreateExamDto) {
    return this.examsService.create(data);
  }

  @Get('get-all')
  findAll() {
    return this.examsService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateExamDto) {
    return this.examsService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }
}
