import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateQuestionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  read: boolean;

  @IsDateString()
  readAt: Date;
}
