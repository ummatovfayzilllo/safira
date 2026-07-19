import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLessonModuleDto {
  @ApiProperty({ example: 'daed' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'a3290f2b-7241-434d-91c4-6c866094fd32' })
  @IsUUID()
  courseId: string;
}
