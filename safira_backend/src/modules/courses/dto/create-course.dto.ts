import { BadRequestException } from '@nestjs/common';
import { CourseLevel } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CourseLevelArr } from 'src/common/types/enum.types';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @Transform((e) => {
    if (isNaN(+e.value)) return undefined;
    if (typeof e.value === 'string') {
      return e.value === '' ? undefined : Number(e.value);
    }
  })
  @IsNumber()
  price: number;

  @Transform((e) => {
    if (isNaN(+e.value)) return undefined;
    if (typeof e.value === 'string') {
      return e.value === '' ? undefined : Number(e.value);
    }
  })
  @IsOptional()
  @IsNumber()
  discount: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  mentorId: string;

  @IsOptional()
  @Transform((e) => {
    if (e.value === 'true') return true;
    return e.value === 'false'
      ? false
      : typeof e.value === 'boolean'
        ? e.value
        : Boolean(e.value);
  })
  @IsBoolean()
  published?: boolean;

  @IsString()
  @IsEnum(CourseLevelArr)
  level: CourseLevel;
}
