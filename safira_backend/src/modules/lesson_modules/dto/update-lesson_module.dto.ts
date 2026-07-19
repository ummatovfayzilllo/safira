import { PartialType } from '@nestjs/swagger';
import { CreateLessonModuleDto } from './create-lesson_module.dto';

export class UpdateLessonModuleDto extends PartialType(CreateLessonModuleDto) {}
