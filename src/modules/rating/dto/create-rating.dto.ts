import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
