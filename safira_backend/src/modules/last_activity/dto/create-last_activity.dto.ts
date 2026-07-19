import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLastActivityDto {
  @ApiProperty({
    example: 'uuid-user-id',
    description: 'Foydalanuvchi IDsi',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'uuid-course-id',
    description: 'Kurs IDsi',
  })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    example: 'uuid-lesson-modul-id',
    description: 'Dars moduli IDsi',
  })
  @IsUUID()
  @IsNotEmpty()
  lessonModulId: string;

  @ApiProperty({
    example: 'uuid-lesson-id',
    description: 'Dars IDsi',
  })
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    example: '/courses/123/lessons/456',
    description: 'Faoliyat URL manzili',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
