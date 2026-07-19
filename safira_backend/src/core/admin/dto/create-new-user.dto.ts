import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from 'src/common/types/user.types';

export class CreateNewUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Foydalanuvchi ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Foydalanuvchi paroli',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRoles.STUDENT,
    enum: UserRoles,
    description: 'Foydalanuvchi roli',
  })
  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Foydalanuvchi rasmi URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
