import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'If statement' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Informai]tion lesson' })
  @IsString()
  about: string;

  @ApiProperty({ example: 'f1b4ebe3-a1fa-4ce0-ab99-aa644d9bc4db' })
  @IsUUID()
  lessonModulId: string;
}
