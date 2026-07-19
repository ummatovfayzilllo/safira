import { IsString, IsUUID } from 'class-validator';

export class CreateHomeworkDto {
  @IsString()
  task: string;

  @IsUUID()
  lessonId: string;
}
