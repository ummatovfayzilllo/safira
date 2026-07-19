import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { PaidVia, PaidViaArr } from 'src/common/types/enum.types';

export class CreatePurcachedCourseDto {
  @ApiProperty({ example: 'f1b4ebe3-a1fa-4ce0-ab99-aa644d9bc4db' })
  @IsUUID()
  userId: string;
  @ApiProperty({ example: 'a3290f2b-7241-434d-91c4-6c866094fd32' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: PaidViaArr })
  @IsEnum(PaidViaArr)
  paidVia: PaidVia;
}
