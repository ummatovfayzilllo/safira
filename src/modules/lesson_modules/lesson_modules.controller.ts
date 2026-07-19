import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonModulesService } from './lesson_modules.service';
import { CreateLessonModuleDto } from './dto/create-lesson_module.dto';
import { UpdateLessonModuleDto } from './dto/update-lesson_module.dto';

@Controller('lesson-modules')
export class LessonModulesController {
  constructor(private readonly lessonModulesService: LessonModulesService) {}

  @Post('create')
  create(@Body() data: CreateLessonModuleDto) {
    return this.lessonModulesService.create(data);
  }

  @Get('getall')
  findAll() {
    return this.lessonModulesService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.lessonModulesService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateLessonModuleDto) {
    return this.lessonModulesService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.lessonModulesService.remove(id);
  }
}
