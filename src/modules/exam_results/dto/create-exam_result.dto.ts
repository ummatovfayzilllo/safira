import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamResultDto {
  @ApiProperty({
    example: 'e7a61d10-4b84-4b1b-9b55-77b8f3a934e1',
    description: 'Dars moduli UUID formatdagi noyob identifikatori',
  })
  @IsUUID()
  lessonModulId: string;

  @ApiProperty({
    example: 'd32e790c-d13e-4c2d-b05e-021a9f8eaf21',
    description: 'Foydalanuvchi UUID formatdagi noyob identifikatori',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: true,
    description:
      "Foydalanuvchi testdan o'tganligini bildiradi (true yoki false)",
  })
  @Transform((e) => {
    if (typeof e.value === 'string') {
      return e.value === 'true'
        ? true
        : e.value === 'false'
          ? false
          : undefined;
    }
    if (typeof e.value === 'boolean') return e.value;
    return undefined;
  })
  @IsBoolean()
  passed: boolean;

  @ApiProperty({
    example: 18,
    description: "Foydalanuvchining to'g'ri javoblar soni",
  })
  @Transform((e) => {
    if (typeof e.value === 'number') return parseInt(`${e.value}`);
    if (typeof e.value === 'string') {
      return e.value === ''
        ? undefined
        : isNaN(parseInt(e.value))
          ? undefined
          : parseInt(e.value);
    }
  })
  @IsNumber()
  corrects: number;

  @ApiProperty({
    example: 2,
    description: "Foydalanuvchining noto\'g\'ri javoblar soni",
  })
  @Transform((e) => {
    if (typeof e.value === 'number') return parseInt(`${e.value}`);
    if (typeof e.value === 'string') {
      return e.value === ''
        ? undefined
        : isNaN(parseInt(e.value))
          ? undefined
          : parseInt(e.value);
    } else return undefined;
  })
  @IsNumber()
  wrongs: number;
}
