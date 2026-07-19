import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateLessonFileDto {
  @IsString()
  note: string;

  @IsUUID()
  lessonId: string;
}
