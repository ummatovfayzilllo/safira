import { Module } from '@nestjs/common';
import { LessonModulesService } from './lesson_modules.service';
import { LessonModulesController } from './lesson_modules.controller';

@Module({
  controllers: [LessonModulesController],
  providers: [LessonModulesService],
})
export class LessonModulesModule {}
