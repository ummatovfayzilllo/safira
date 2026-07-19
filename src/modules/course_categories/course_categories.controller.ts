import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseCategoriesService } from './course_categories.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { Public } from 'src/global/decorators/auth.decorators';

@Controller('course-categories')
export class CourseCategoriesController {
  constructor(
    private readonly courseCategoriesService: CourseCategoriesService,
  ) {}

  @Post('create')
  create(@Body() data: CreateCourseCategoryDto) {
    return this.courseCategoriesService.create(data);
  }

  @Public()
  @Get('get-all')
  findAll() {
    return this.courseCategoriesService.findAll();
  }

  @Public()
  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.courseCategoriesService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: CreateCourseCategoryDto) {
    return this.courseCategoriesService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.courseCategoriesService.remove(id);
  }
}
