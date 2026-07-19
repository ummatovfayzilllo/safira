import { Module } from '@nestjs/common';
import { LessonFilesService } from './lesson_files.service';
import { LeesonFilesController } from './lesson_files.controller';
@Module({
  controllers: [LeesonFilesController],
  providers: [LessonFilesService],
})
export class LessonFilesModule {}
