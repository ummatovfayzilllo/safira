import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class VerifyPasswordResetDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 123456 })
  @Transform((e) => {
    if (typeof e.value === 'number') {
      return e.value;
    } else if (typeof e.value === 'string') {
      return e.value === '' ? undefined : +e.value;
    } else {
      return undefined;
    }
  })
  @IsNumber()
  code: number;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  newPassword: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: "Parolingiz muvaffaqiyatli o'zgartirildi" })
  message: string;
}
