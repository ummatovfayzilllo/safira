import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateQuestionAnswerDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
