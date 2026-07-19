import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAssignedCourseDto {
  @ApiProperty({ example: 'a3290f2b-7241-434d-91c4-6c866094fd32' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'a3290f2b-7241-434d-91c4-6c866094fd32' })
  @IsUUID()
  courseId: string;
}
