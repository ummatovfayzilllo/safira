import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MentorProfilesModule } from './modules/mentor_profiles/mentor_profiles.module';
import { CourseCategoriesModule } from './modules/course_categories/course_categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AssignedCoursesModule } from './modules/assigned_courses/assigned_courses.module';
import { PurcachedCoursesModule } from './modules/purcached_courses/purcached_courses.module';
import { RatingModule } from './modules/rating/rating.module';
import { LastActivityModule } from './modules/last_activity/last_activity.module';
import { LessonModulesModule } from './modules/lesson_modules/lesson_modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { LessonFilesModule } from './modules/lesson_files/lesson_files.module';
import { LessonViewsModule } from './modules/lesson_views/lesson_views.module';
import { HomeworksModule } from './modules/homeworks/homeworks.module';
import { HomeworkSubmissionsModule } from './modules/homework_submissions/homework_submissions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ExamResultsModule } from './modules/exam_results/exam_results.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { QuestionAnswersModule } from './modules/question_answers/question_answers.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './global/guards/jwt.auth.guard';
import { CoreModule } from './core/core.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    MentorProfilesModule,
    CourseCategoriesModule,
    CoursesModule,
    AssignedCoursesModule,
    PurcachedCoursesModule,
    RatingModule,
    LastActivityModule,
    LessonModulesModule,
    LessonsModule,
    LessonFilesModule,
    LessonViewsModule,
    HomeworksModule,
    HomeworkSubmissionsModule,
    ExamsModule,
    ExamResultsModule,
    QuestionsModule,
    QuestionAnswersModule,
    ContactModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
