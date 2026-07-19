import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer, ExamAnswerArr } from 'src/common/types/enum.types';

export class CreateExamDto {
  @ApiProperty({
    example: "JavaScriptda '===' operatorining vazifasi nima?",
    description: 'Dasturlash bo‘yicha berilgan test savoli',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example: 'Qiymatni solishtiradi, lekin turini emas',
    description: 'A javobi varianti',
  })
  @IsString()
  @IsNotEmpty()
  variantA: string;

  @ApiProperty({
    example: 'Faqat turini solishtiradi',
    description: 'B javobi varianti',
  })
  @IsString()
  @IsNotEmpty()
  variantB: string;

  @ApiProperty({
    example: 'Qiymat va turini solishtiradi',
    description: "C javobi varianti (to'g'ri javob)",
  })
  @IsString()
  @IsNotEmpty()
  variantC: string;

  @ApiProperty({
    example: 'Faqat raqamlarni solishtiradi',
    description: 'D javobi varianti',
  })
  @IsString()
  @IsNotEmpty()
  variantD: string;

  @ApiProperty({
    example: 'C',
    enum: ExamAnswerArr,
    description: "To'g'ri javob varianti (A, B, C, D dan biri)",
  })
  @IsEnum(ExamAnswerArr)
  answer: ExamAnswer;

  @ApiProperty({
    example: 'c2a4e7d3-82b2-4b9a-bb4d-126d56ad2f25',
    description:
      "Dars modulining UUID identifikatori (masalan, 'JavaScript Asoslari')",
  })
  @IsUUID()
  lessonModulId: string;
}
