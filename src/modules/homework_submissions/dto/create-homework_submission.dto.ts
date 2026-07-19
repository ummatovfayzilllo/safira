import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  HomeworkSubStatus,
  HomeWorkSubStatusArr,
} from 'src/common/types/enum.types';

export class CreateHomeworkSubmissionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsUUID()
  homeworkId: string;

  @IsUUID()
  userId: string;

  @IsEnum(HomeWorkSubStatusArr)
  status: HomeworkSubStatus;
}
