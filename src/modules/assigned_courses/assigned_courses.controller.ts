import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssignedCoursesService } from './assigned_courses.service';
import { CreateAssignedCourseDto } from './dto/create-assigned_course.dto';
import { UpdateAssignedCourseDto } from './dto/update-assigned_course.dto';

@Controller('assigned-courses')
export class AssignedCoursesController {
  constructor(
    private readonly assignedCoursesService: AssignedCoursesService,
  ) {}

  @Post('create-one')
  create(@Body() data: CreateAssignedCourseDto) {
    return this.assignedCoursesService.create(data);
  }

  @Get('getall')
  findAll() {
    return this.assignedCoursesService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.assignedCoursesService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() data: UpdateAssignedCourseDto) {
    return this.assignedCoursesService.update(id, data);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.assignedCoursesService.remove(id);
  }
}
