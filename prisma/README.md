# Prisma Schema Overview

PostgreSQL-based education platform. **6 enums** (Role, Action, CourseLevel, PaidVia, HomeworkSubStatus, ExamAnswer). **Core models**: User (4 roles), Course, Lesson, Homework, Exam. **Relations**: Mentor→User, Assignment→Course→Lesson, Homework→Submission→User, Exam→Result. Cascading deletes on FK constraints. UUID primary keys.
