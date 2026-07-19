import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: '99891 123 45 67' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Enter your message ...' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
