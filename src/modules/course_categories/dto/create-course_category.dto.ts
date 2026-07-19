import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @ApiProperty({
    description: 'Kurs kategoriyasi nomi',
    example: 'Dasturlash',
  })
  @IsString({ message: "name maydoni satr (string) bo'lishi kerak" })
  name: string;
}

/*
  @ApiProperty({
    description: 'Kurs kategoriyasi uchun tavsif (majburiy emas)',
    example: 'Frontend, Backend yoki boshqa yo‘nalishlar',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'description maydoni satr (string) bo‘lishi kerak' })
  description?: string;
*/
