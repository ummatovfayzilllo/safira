import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty({
    example: 'uuid-user-id',
    description: 'Foydalanuvchi IDsi',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'uuid-question-id',
    description: 'Savol IDsi',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    example: 'Bu javobim...',
    description: 'Javob matni',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    example: 'https://example.com/file.pdf',
    description: 'Faylning URL manzili (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  file?: string;
}
