import { IsUUID } from 'class-validator';

export class CreateLessonViewDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  lessonId: string;
}

/*
  userId    String
  user      User     @relation(fields: [userId], references: [id],onDelete: Cascade)
  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id],onDelete: Cascade)
  view      Boolean
*/
