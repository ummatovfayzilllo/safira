# Edfix Backend Architecture

## Project Overview
**Name:** Imtihon (Educational Platform Backend)  
**Framework:** NestJS 11.0.1  
**Language:** TypeScript 5.7.3  
**Database:** PostgreSQL (via Prisma ORM)  
**Port:** 15975 (default)  
**API Documentation:** Swagger UI

---

## Project Structure

```
src/
├── common/              # Shared utilities and configurations
│   ├── config/          # Application configuration (auth, etc.)
│   ├── interfaces/      # Shared interfaces
│   ├── types/           # TypeScript type definitions (being migrated to utils/)
│   └── utils/           # Helper functions, validators, generators, JWT helpers
├── core/                # Core modules and services
│   ├── admin/           # Admin functionality (roles, permissions)
│   ├── auth/            # Authentication module (login, registration)
│   ├── email/           # Email service integration
│   ├── error/           # Error handling
│   ├── jwt/             # JWT token management
│   ├── prisma/          # Prisma client setup
│   ├── services/        # Shared services (file streaming, etc.)
│   └── use_initilation.ts  # Global app initialization
├── global/              # Global middleware, decorators, guards
│   ├── decorators/      # Custom decorators (@Public, @UserData, etc.)
│   ├── guards/          # Auth guards (JWT, Role-based)
│   └── middlewares/     # Express middlewares
└── modules/             # Feature modules (modular architecture)
    ├── users/           # User management
    ├── courses/         # Course management
    ├── lessons/         # Lesson content
    ├── homeworks/       # Homework assignments
    ├── exams/           # Exam questions
    ├── questions/       # Q&A forum
    └── [16 other modules...]
```

---

## Modules List

| Module | Purpose | Key Entities |
|--------|---------|--------------|
| **Users** | User authentication, profiles, management | User |
| **Auth** | Login, registration, JWT tokens | Session handling |
| **Admin** | Roles, permissions, admin operations | Role, Permission |
| **Courses** | Course creation and management | Course, CourseCategory |
| **Course Categories** | Category management for courses | CourseCategory |
| **Lessons** | Lesson content and organization | Lesson, LessonModule |
| **Lesson Modules** | Grouping lessons within courses | LessonModule |
| **Lesson Files** | File attachments for lessons | LessonFile |
| **Lesson Views** | Track lesson viewing progress | LessonView |
| **Homeworks** | Homework assignments | Homework |
| **Homework Submissions** | Student homework submissions | HomeworkSubmission |
| **Exams** | Exam questions and answers | Exam, ExamResult |
| **Exam Results** | Student exam results and scores | ExamResult |
| **Questions** | Student Q&A questions | Question |
| **Question Answers** | Answers to student questions | QuestionAnswer |
| **Assigned Courses** | Assign courses to students | AssignedCourse |
| **Purchased Courses** | Track paid course purchases | PurchasedCourse |
| **Mentor Profiles** | Mentor profile information | MentorProfile |
| **Rating** | Course ratings and reviews | Rating |
| **Last Activity** | Track user activity in courses | LastActivity |
| **Contact** | Contact form submissions | Contact |

---

## Module Structure (Standard Pattern)

Each feature module follows this structure:
```
module-name/
├── module-name.controller.ts    # HTTP endpoints
├── module-name.service.ts       # Business logic
├── module-name.module.ts        # Module definition
├── dto/
│   ├── create-*.dto.ts         # Creation DTOs with validation
│   └── update-*.dto.dto.ts     # Update DTOs
└── entities/
    └── *.entity.ts             # Database entities (Prisma models)
```

---

## Database Models & Relationships

### Core Entities

**User**
- Roles: ADMIN, MENTOR, ASSISTANT, STUDENT
- Relations: courses, mentorProfile, ratings, submissions, exam results, questions
- Fields: fullName, email, password, image, role

**MentorProfile**
- Links user to mentor info (about, experience, social links)
- Can create and manage courses
- One-to-one with User

**Course**
- Levels: BEGINNER, PRE_INTERMEDIATE, INTERMEDIATE, UPPER_INTERMEDIATE, ADVANCED
- Has modules (LessonModule) → lessons → files
- Supports pricing and discounts
- Relations: mentor, category, ratings, assignments, purchases

**LessonModule**
- Organizes lessons within a course
- Contains exams for module
- Tracks student exam results

**Lesson**
- Contains video content
- Has attachments (LessonFile)
- Can have homework assignments
- Tracks views (LessonView)

**Homework** → **HomeworkSubmission**
- Teachers assign tasks, students submit
- Status: PENDING, APPROVED, REJECTED

**Exam** → **ExamResult**
- Multiple choice questions (A, B, C, D)
- Tracks student performance

**Question** → **QuestionAnswer**
- Student Q&A forum
- Tracks read status

**Payment Models**
- PurchasedCourse: tracks paid enrollments (PayMe, CLICK, CASH)
- Rating: course reviews and comments

---

## Key Dependencies

### Core Framework
- `@nestjs/common`, `@nestjs/core` (11.0.1) - NestJS framework
- `@nestjs/config` (4.0.2) - Environment configuration
- `@nestjs/jwt` (11.0.0) - JWT authentication
- `@nestjs/platform-express` (11.0.1) - Express integration
- `@nestjs/swagger` (11.2.0) - API documentation

### Database & ORM
- `@prisma/client` (6.12.0) - Prisma ORM client
- `prisma` (6.12.0) - Prisma CLI

### Authentication & Security
- `bcrypt` (6.0.0) - Password hashing
- `@nestjs/jwt` - Token management
- JWT guards for route protection

### File Handling
- `multer` (2.0.2) - File upload handling
- `multer-storage-cloudinary` (4.0.0) - Cloud storage
- `cloudinary` (1.41.3) - Image/file hosting
- `mime-types` (3.0.1) - MIME type detection

### Email & Communication
- `nodemailer` (7.0.5) - Email service
- `useragent` (2.3.0) - User agent parsing

### Validation & Transformation
- `class-validator` (0.14.2) - DTO validation
- `class-transformer` (0.5.1) - DTO transformation

### HTTP & Middleware
- `express` (5.1.0) - Web framework
- `cookie-parser` (1.4.7) - Cookie handling
- `swagger-ui-express` (5.0.1) - Swagger UI
- `reflect-metadata` (0.2.2) - Metadata reflection

### Reactive Programming
- `rxjs` (7.8.1) - Reactive streams

---

## API Endpoints (Sample)

### Users Module
- `POST /users/create` - Create new user (multipart with image)
- `PATCH /users/updateimage/:id` - Update user profile image
- `GET /users/[routes]` - Get users data

### Courses Module
- `POST /courses/create-one` - Create course
- `GET /courses/getall` - List all courses
- `GET /courses/get-one/:id` - Get course details
- `PATCH /courses/update-one/:id` - Update course
- `DELETE /courses/delete-one/:id` - Delete course

### Lessons Module
- `POST /lessons/create-one` - Create lesson
- `GET /lessons/getall` - List lessons
- `GET /lessons/get-one/:id` - Get lesson details
- `PATCH /lessons/update-one/:id` - Update lesson
- `DELETE /lessons/delete-one/:id` - Delete lesson

### Similar endpoints for:
- `/homeworks` - Homework management
- `/homework_submissions` - Submission tracking
- `/exams` - Exam questions
- `/exam_results` - Student results
- `/questions` - Q&A forum
- `/question_answers` - Answers
- `/lessons/:id/files` - Lesson files
- All other modules follow similar REST patterns

---

## Authentication & Security

- **JWT Guard:** Global JWT authentication via `JwtAuthGuard`
- **Public Routes:** Marked with `@Public()` decorator (login, register)
- **User Data:** Accessed via `@UserData()` decorator
- **Role-based Access:** Permission system with CRUD actions
- **Password Security:** Bcrypt hashing

---

## File Storage & Media

- **Storage Service:** `FileStreamService` (src/core/services/file.stream.service.ts)
- **Cloud Provider:** Cloudinary integration
- **File Types:** Image, document, video uploads supported
- **Multer Config:** Custom storage handlers in `common/utils/file_storages_.ts`

---

## Build & Scripts

```bash
npm run build          # Compile TypeScript
npm run start          # Production server
npm run start:dev      # Development with watch
npm run start:debug    # Debug mode
npm run test           # Run tests
npm run test:cov       # Coverage report
npm run lint           # ESLint fix
npm run format         # Prettier format
```

---

## Environment Configuration

Required `.env` variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 15975)
- `APP_BASE_URL` - Application base URL
- JWT secrets and configuration
- Cloudinary API credentials
- Email service credentials (Nodemailer)

---

## Logging Points

### Startup Logs (npm run start:dev)
1. **NestFactory Initialization**
   - `Starting Nest application...`

2. **Module Dependencies Loading** (in order)
   - PrismaModule → Database connection
   - EmailModule, ConfigModule, JwtModule
   - CoreModule → Core services
   - All feature modules (UsersModule, CoursesModule, etc.)

3. **Route Mapping** (RouterExplorer logs)
   - File streaming routes: `/api/video/:file`, `/api/image/:file`, `/api/archive/:file`, `/api/docs/:file`
   - Auth routes: `/api/auth/register`, `/api/auth/verify`, `/api/auth/login`
   - Admin routes: `/api/admin/assign-role`, `/api/admin/create-permission`, etc.
   - User routes: `/api/users/create`, `/api/users/updateimage/:id`
   - Course routes: `/api/courses/create-one`, `/api/courses/getall`, `/api/courses/get-one/:id`, etc.
   - Lesson routes: `/api/lessons/create-one`, `/api/lessons/getall`, `/api/lessons/get-one/:id`, etc.
   - Homework, Exam, Questions, and other module routes (all following CRUD pattern)

4. **Critical Startup Logs**
   - `Database connected !` - Prisma connection successful
   - `Nest application successfully started` - App ready to serve requests

5. **Custom Console Logs** (from main.ts)
   - `{APP_BASE_URL}/api-docs` - Swagger UI location
   - `Action test` - Test action indicator
   - `Memory function tugadi` - Memory monitoring completion

### Application-Level Logging Points (in services)

**Error Logging:**
- `console.log(error)` - Error messages logged in catch blocks across:
  - `homeworks.service.ts` - Homework operations
  - `lesson_modules.service.ts` - Lesson module operations
  - `course_categories.service.ts` - Category operations
  - `users.service.ts` - User operations
  - `assigned_courses.service.ts` - Course assignment operations
  - `courses.service.ts` - Course operations
  - `purcached_courses.service.ts` - Purchase operations
  - `questions.service.ts` - Question operations
  - `exams.service.ts` - Exam operations

**Debug Logging:**
- `users.service.ts:` 
  - `console.log(data, image)` - User creation data
  - `console.log(hashedPass)` - Password hashing verification
  - `console.log(userPassword, password)` - Login password comparison

**Other Logs:**
- No dedicated logger instance (NestJS Logger not configured) - only console.log used

---

## Notes

- **Migration in Progress:** Type files being moved from `src/common/types/` to `src/common/utils/`
- **Database:** PostgreSQL with Prisma migrations in `prisma/migrations/`
- **API Docs:** Swagger/OpenAPI available at `/api-docs`
- **Testing:** Jest configured with coverage reporting
- **Logging:** Currently uses console.log for debugging; consider migrating to NestJS Logger for production
