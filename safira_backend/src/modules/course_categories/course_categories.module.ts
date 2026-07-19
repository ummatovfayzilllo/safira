import { Module } from '@nestjs/common';
import { CourseCategoriesService } from './course_categories.service';
import { CourseCategoriesController } from './course_categories.controller';

@Module({
  controllers: [CourseCategoriesController],
  providers: [CourseCategoriesService],
})
export class CourseCategoriesModule {}
