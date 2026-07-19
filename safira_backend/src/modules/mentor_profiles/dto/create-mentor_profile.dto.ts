import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsUrl, IsUUID } from 'class-validator';

export class CreateMentorProfileDto {
  @ApiProperty({
    example: 'Senior Backend Developer with 10 years of experience.',
    description: 'Mentorning qisqacha tanishtiruvi.',
    required: false,
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Mentorning hozirgi kasbi yoki lavozimi.',
    required: false,
  })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiProperty({
    example: 5,
    description: 'Necha yil tajribaga ega ekanligi.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  experience?: number;

  @ApiProperty({
    example: 'https://t.me/mentor_username',
    description: 'Mentorning Telegram havolasi.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  telegram?: string;

  @ApiProperty({
    example: 'https://instagram.com/mentor_username',
    description: 'Mentorning Instagram havolasi.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({
    example: 'https://linkedin.com/in/mentor_username',
    description: 'Mentorning LinkedIn havolasi.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiProperty({
    example: 'https://facebook.com/mentor_username',
    description: 'Mentorning Facebook havolasi.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({
    example: 'https://github.com/mentor_username',
    description: 'Mentorning GitHub havolasi.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiProperty({
    example: 'https://mentor.com',
    description: 'Mentorga oid shaxsiy veb-sayt havolasi.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    example: 'a7d8a7c2-65d3-4c77-b33e-2b725c15c6cb',
    description: 'Foydalanuvchining ID raqami (UUID formatda).',
  })
  @IsUUID()
  userId: string;
}
