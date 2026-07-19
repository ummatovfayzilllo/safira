import { Module } from '@nestjs/common';
import { AssignedCoursesService } from './assigned_courses.service';
import { AssignedCoursesController } from './assigned_courses.controller';

@Module({
  controllers: [AssignedCoursesController],
  providers: [AssignedCoursesService],
})
export class AssignedCoursesModule {}
