generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MENTOR
  ASSISTANT
  STUDENT
}

enum Action {
  GET
  POST
  PUT
  PATCH
  DELETE
}

enum CourseLevel {
  BEGINNER
  PRE_INTERMEDIATE
  INTERMEDIATE
  UPPER_INTERMEDIATE
  ADVANCED
}

enum PaidVia {
  PAYME
  CLICK
  CASH
}

enum HomeworkSubStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ExamAnswer {
  A
  B
  C
  D
}

model User {
  id                 String               @id @default(uuid())
  fullName           String?
  password           String
  email              String               @unique
  image              String?
  role               Role                 @default(STUDENT)
  mentorProfile      MentorProfile?
  assignedCourses    AssignedCourse[]
  PurcachedCourse    PurcachedCourse[]
  Rating             Rating[]
  LastActivity       LastActivity[]
  LessonView         LessonView[]
  HomeworkSubmission HomeworkSubmission[]
  ExamResult         ExamResult[]
  Question           Question[]
  QuestionAnswer     QuestionAnswer[]
  Permission         Permission[]
  updatedAt          DateTime             @default(now())
  createdAt          DateTime             @default(now())
}

model Permission {
  id        String   @id @default(uuid())
  model     String
  actions   Action[]
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())
}

model MentorProfile {
  id         String   @id @default(uuid())
  about      String?
  job        String?
  experience Int?
  telegram   String?
  instagram  String?
  linkedin   String?
  facebook   String?
  github     String?
  website    String?
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id])
  courses    Course[]
  updatedAt  DateTime @default(now())
  createdAt  DateTime @default(now())
}

model CourseCategory {
  id        String   @id @default(uuid())
  name      String
  courses   Course[]
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())
}

model Course {
  id              String            @id @default(uuid())
  name            String
  about           String
  price           Float?
  banner          String?
  introVideo      String?
  level           CourseLevel
  published       Boolean           @default(false)
  categoryId      String
  category        CourseCategory    @relation(fields: [categoryId], references: [id])
  mentorId        String
  mentor          MentorProfile     @relation(fields: [mentorId], references: [id])
  assignedCourses AssignedCourse[]
  PurcachedCourse PurcachedCourse[]
  Rating          Rating[]
  LastActivity    LastActivity[]
  LessonModul     LessonModul[]
  Question        Question[]
  updatedAt       DateTime          @default(now())
  createdAt       DateTime          @default(now())
}

model AssignedCourse {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  courseId  String
  courses   Course   @relation(fields: [courseId], references: [id])
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())
}

model PurcachedCourse {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  courseId    String
  courses     Course   @relation(fields: [courseId], references: [id])
  amount      Float
  paidVia     PaidVia
  purcachedAt DateTime @default(now())
  updatedAt   DateTime @default(now())
  createdAt   DateTime @default(now())
}

model Rating {
  id        String   @id @default(uuid())
  rate      Float
  comment   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  courseId  String
  courses   Course   @relation(fields: [courseId], references: [id])
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())
}

model LastActivity {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  courseId      String
  courses       Course      @relation(fields: [courseId], references: [id])
  lessonModulId String
  lessonModule  LessonModul @relation(fields: [lessonModulId], references: [id])
  lessonId      String
  lesson        Lesson      @relation(fields: [lessonId], references: [id])
  url           String
  updatedAt     DateTime    @default(now())
  createdAt     DateTime    @default(now())
}

model LessonModul {
  id           String         @id @default(uuid())
  name         String
  courseId     String
  Course       Course         @relation(fields: [courseId], references: [id])
  Lesson       Lesson[]
  Exam         Exam[]
  ExamResult   ExamResult[]
  LastActivity LastActivity[]
  updatedAt    DateTime       @default(now())
  createdAt    DateTime       @default(now())
}

model Lesson {
  id            String         @id @default(uuid())
  name          String
  about         String?
  video         String?
  lessonModulId String
  module        LessonModul    @relation(fields: [lessonModulId], references: [id])
  LessonView    LessonView[]
  Homework      Homework[]
  LastActivity  LastActivity[]
  LessonFile    LessonFile[]
  updatedAt     DateTime       @default(now())
  createdAt     DateTime       @default(now())
}

model LessonView {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  view      Boolean
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())
}

model LessonFile {
  id        String   @id @default(uuid())
  file      String?
  note      String
  lessonId  String
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())
}

model Homework {
  id                 String               @id @default(uuid())
  task               String
  files              String[]
  lessonId           String
  lesson             Lesson               @relation(fields: [lessonId], references: [id])
  HomeworkSubmission HomeworkSubmission[]
  updatedAt          DateTime             @default(now())
  createdAt          DateTime             @default(now())
}

model HomeworkSubmission {
  id         String            @id @default(uuid())
  text       String
  files      String[]
  reason     String
  status     HomeworkSubStatus @default(PENDING)
  homeworkId String
  homeWork   Homework          @relation(fields: [homeworkId], references: [id])
  userId     String
  user       User              @relation(fields: [userId], references: [id])
  updatedAt  DateTime          @default(now())
  createdAt  DateTime          @default(now())
}

model Exam {
  id            String      @id @default(uuid())
  question      String
  variantA      String
  variantB      String
  variantC      String
  variantD      String
  answer        ExamAnswer
  lessonModulId String
  lessonModule  LessonModul @relation(fields: [lessonModulId], references: [id])
  updatedAt     DateTime    @default(now())
  createdAt     DateTime    @default(now())
}

model ExamResult {
  id            String      @id @default(uuid())
  lessonModulId String
  lessonModule  LessonModul @relation(fields: [lessonModulId], references: [id])
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  passed        Boolean
  corrects      Int
  wrongs        Int
  updatedAt     DateTime    @default(now())
  createdAt     DateTime    @default(now())
}

model Question {
  id             String           @id @default(uuid())
  userId         String
  user           User             @relation(fields: [userId], references: [id])
  courseId       String
  course         Course           @relation(fields: [courseId], references: [id])
  text           String
  file           String?
  read           Boolean
  readAt         DateTime
  updatedAt      DateTime         @default(now())
  createdAt      DateTime         @default(now())
  QuestionAnswer QuestionAnswer[]
}

model QuestionAnswer {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  questionId String
  question   Question @relation(fields: [questionId], references: [id])
  text       String
  file       String?
  updatedAt  DateTime @default(now())
  createdAt  DateTime @default(now())
}
