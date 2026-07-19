import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import { Action } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

export class CreatePermissionDto {
  @ApiProperty({
    example: ModelsEnumInPrisma.COURSES,
    enum: ModelsEnumInPrisma,
  })
  @IsNotEmpty()
  @IsEnum(ModelsEnumInPrisma)
  model: ModelsEnumInPrisma;

  @ApiProperty({
    example: [Action.GET, Action.POST],
    isArray: true,
    enum: Action,
  })
  @IsArray()
  @IsEnum(Action, { each: true })
  actions: Action[];

  @ApiProperty({
    example: '60f1b5c3e13f4a001c4e2b1a',
    description: 'Foydalanuvchi IDsi',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
